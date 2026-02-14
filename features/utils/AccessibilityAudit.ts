import { Page, TestInfo } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import * as fs from 'fs';
import * as path from 'path';

/**
 * WCAG audit utility with non-blocking results.
 */
export class AccessibilityAudit {
  private page: Page;
  private violations: AccessibilityViolation[] = [];
  private auditResults: AuditResult[] = [];
  private outputDir: string;

  constructor(page: Page, outputDir: string = 'a11y-results') {
    this.page = page;
    this.outputDir = outputDir;
    this.ensureOutputDirectory();
  }

  private ensureOutputDirectory(): void {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async auditPage(context: string): Promise<AuditResult> {
    return this.runAudit({ context });
  }

  async auditPageWithInclude(context: string, includeSelector: string): Promise<AuditResult> {
    return this.runAudit({ context, includeSelector });
  }

  async attachViolations(testInfo: TestInfo, context: string, attachmentName = 'accessibility-violations'): Promise<void> {
    const violations = this.getViolationsByContext(context);
    if (violations.length === 0) return;

    await testInfo.attach(attachmentName, {
      body: JSON.stringify(violations, null, 2),
      contentType: 'application/json'
    });
  }

  async attachLocatorFallbacks(testInfo: TestInfo, missingLabels: string[], attachmentName = 'a11y-locator-fallbacks'): Promise<void> {
    if (missingLabels.length === 0) return;

    await testInfo.attach(attachmentName, {
      body: JSON.stringify({ missingLabels }, null, 2),
      contentType: 'application/json'
    });
  }

  private async runAudit({ context, includeSelector }: { context: string; includeSelector?: string }): Promise<AuditResult> {
    const startTime = Date.now();

    try {
      const builder = new AxeBuilder({ page: this.page })
        .withTags(['wcag2aa', 'wcag21aa']);

      if (includeSelector) {
        builder.include(includeSelector);
      }

      const results = await builder.analyze();
      const duration = Date.now() - startTime;
      const violations = results.violations || [];
      const processed = this.processViolations(violations, context);

      const auditResult: AuditResult = {
        timestamp: new Date().toISOString(),
        context,
        duration,
        url: this.page.url(),
        violations: processed,
        summary: {
          total: processed.length,
          critical: processed.filter(v => v.impact === 'critical').length,
          serious: processed.filter(v => v.impact === 'serious').length,
          moderate: processed.filter(v => v.impact === 'moderate').length,
          minor: processed.filter(v => v.impact === 'minor').length,
          passed: processed.length === 0
        },
        passed: processed.length === 0
      };

      this.auditResults.push(auditResult);
      this.violations.push(...processed);
      this.logSummary(auditResult);

      return auditResult;
    } catch (error) {
      console.error(`❌ Audit error for "${context}":`, error);

      const errorResult: AuditResult = {
        timestamp: new Date().toISOString(),
        context,
        duration: Date.now() - startTime,
        url: this.page.url(),
        violations: [],
        summary: {
          total: 0,
          critical: 0,
          serious: 0,
          moderate: 0,
          minor: 0,
          passed: false
        },
        passed: false,
        error: error instanceof Error ? error.message : String(error)
      };

      this.auditResults.push(errorResult);
      return errorResult;
    }
  }

  private processViolations(violations: any[], context: string): AccessibilityViolation[] {
    return violations.map(violation => ({
      id: violation.id,
      impact: violation.impact || 'unknown',
      description: violation.description || '',
      help: violation.help || '',
      helpUrl: violation.helpUrl || '',
      tags: violation.tags || [],
      context,
      elements: violation.nodes?.map((node: any) => ({
        selector: node.target?.join(' > ') || 'unknown',
        html: node.html || '',
        message: node.failureSummary || ''
      })) || [],
      timestamp: new Date().toISOString()
    }));
  }

  private logSummary(result: AuditResult): void {
    if (result.error) {
      console.log(`\n⚠️  Audit Error: ${result.context}`);
      return;
    }

    const { summary } = result;
    const hasViolations = summary.total > 0;

    console.log(`\n${hasViolations ? '⚠️ ' : '✅ '} Accessibility: ${result.context}`);
    console.log(`   Duration: ${result.duration}ms | URL: ${result.url}`);

    if (summary.total === 0) {
      console.log(`   ✅ No violations found`);
    } else {
      console.log(`   Total: ${summary.total}`);
      if (summary.critical > 0) console.log(`   🔴 Critical: ${summary.critical}`);
      if (summary.serious > 0) console.log(`   🟠 Serious: ${summary.serious}`);
      if (summary.moderate > 0) console.log(`   🟡 Moderate: ${summary.moderate}`);
      if (summary.minor > 0) console.log(`   🔵 Minor: ${summary.minor}`);
    }
  }

  logAuditResults(results: any, scope: string = 'Page'): void {
    const criticalCount = results.violations.filter((v: any) => v.impact === 'critical').length;
    const seriousCount = results.violations.filter((v: any) => v.impact === 'serious').length;
    const moderateCount = results.violations.filter((v: any) => v.impact === 'moderate').length;

    console.log(`Analyzing ${scope} accessibility results...`);
    console.log(`  Critical Issues: ${criticalCount}`);
    console.log(`  Serious Issues: ${seriousCount}`);
    console.log(`  Moderate Issues: ${moderateCount}`);

    if (results.violations.length === 0) {
      console.log(`✅ ${scope}: WCAG 2.1 AA COMPLIANT`);
    } else {
      console.log(`⚠️  ${scope}: WCAG 2.1 AA violations found`);
      console.log('  Violations logged to audit trail (test continues)');
    }
  }

  getViolationsByImpact(impact: 'critical' | 'serious' | 'moderate' | 'minor'): AccessibilityViolation[] {
    return this.violations.filter(v => v.impact === impact);
  }

  getViolationsByContext(context: string): AccessibilityViolation[] {
    return this.violations.filter(v => v.context === context);
  }

  getStatistics(): ViolationStatistics {
    return {
      total: this.violations.length,
      critical: this.violations.filter(v => v.impact === 'critical').length,
      serious: this.violations.filter(v => v.impact === 'serious').length,
      moderate: this.violations.filter(v => v.impact === 'moderate').length,
      minor: this.violations.filter(v => v.impact === 'minor').length,
      auditsPerformed: this.auditResults.length,
      passed: this.violations.length === 0
    };
  }

  async exportResults(): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = path.join(this.outputDir, `a11y-audit-${timestamp}.json`);

    const exportData = {
      metadata: {
        generated: new Date().toISOString(),
        standard: 'WCAG 2.1 AA',
        totalAudits: this.auditResults.length,
        totalViolations: this.violations.length,
        criticalCount: this.violations.filter(v => v.impact === 'critical').length,
        seriousCount: this.violations.filter(v => v.impact === 'serious').length
      },
      audits: this.auditResults,
      violations: this.violations
    };

    fs.writeFileSync(filename, JSON.stringify(exportData, null, 2));
    console.log(`\n📄 Accessibility audit results exported to: ${filename}`);

    return filename;
  }

  clear(): void {
    this.violations = [];
    this.auditResults = [];
  }
}

export interface AccessibilityViolation {
  id: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor' | 'unknown';
  description: string;
  help: string;
  helpUrl: string;
  tags: string[];
  context: string;
  elements: ViolationElement[];
  timestamp: string;
}

export interface ViolationElement {
  selector: string;
  html: string;
  message: string;
}

export interface AuditResult {
  timestamp: string;
  context: string;
  duration: number;
  url: string;
  violations: AccessibilityViolation[];
  summary: ViolationStatistics;
  passed: boolean;
  error?: string;
}

export interface ViolationStatistics {
  total: number;
  critical: number;
  serious: number;
  moderate: number;
  minor: number;
  auditsPerformed?: number;
  passed: boolean;
}
