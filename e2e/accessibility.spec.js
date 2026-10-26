import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * End-to-end checks against the compiled site. These supplement, not replace,
 * a human screen-reader and low-vision review.
 */
async function scan(page){
 const report=await new AxeBuilder({page})
  .withRules([
   'aria-hidden-focus','aria-required-attr','aria-roles','aria-valid-attr',
   'button-name','link-name','label','document-title','html-has-lang',
   'duplicate-id','nested-interactive'
  ]).analyze();
 expect(report.violations.map(v=>({rule:v.id,impact:v.impact,
  nodes:v.nodes.slice(0,3).map(n=>n.target)}))).toEqual([]);
}

test('public landing and Start Here controls expose valid names and semantics',async({page})=>{
 await page.goto('./');
 await expect(page.locator('#daily .daily-meal')).toHaveCount(3);
 await scan(page);
 await page.locator('#start-here .get-started-path').nth(3).click();
 await scan(page);
});

test('original manuscript dialog traps Tab, Escape closes, and focus returns to its launcher',async({page})=>{
 await page.goto('./');
 await expect(page.locator('.archive-status')).toContainText('21 of 21 canonical originals');
 const trigger=page.locator('.archive-entry-actions button').first();
 await trigger.focus();
 await page.keyboard.press('Enter');
 const dialog=page.getByRole('dialog',{name:/Original manuscript/});
 await expect(dialog).toBeVisible();
 const close=dialog.getByRole('button',{name:'Close original manuscript'});
 await expect(close).toBeFocused();
 await expect(page.locator('body')).toHaveCSS('overflow','hidden');
 await scan(page);
 await page.keyboard.press('Shift+Tab');
 await expect(dialog.locator('.archive-modal-footer button')).toBeFocused();
 await page.keyboard.press('Tab');
 await expect(close).toBeFocused();
 await page.keyboard.press('Escape');
 await expect(dialog).toHaveCount(0);
 await expect(trigger).toBeFocused();
 await expect(page.locator('body')).not.toHaveCSS('overflow','hidden');
});

test('mobile Explore menu closes on Escape and after navigating to source sections',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('./');
 const details=page.locator('header .mobile-navigation');
 const summary=details.locator('summary');
 await summary.focus();
 await page.keyboard.press('Enter');
 await expect(details).toHaveAttribute('open','');
 await page.keyboard.press('Escape');
 await expect(details).not.toHaveAttribute('open','');
 await expect(summary).toBeFocused();
 await page.keyboard.press('Enter');
 await details.getByRole('link',{name:'Original library'}).click();
 await expect(page).toHaveURL(/#library$/);
 await expect(details).not.toHaveAttribute('open','');
 await expect(page.locator('#library')).toBeFocused();
 await scan(page);
});

test('reduced-motion preference removes smooth scrolling and control animations',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('./');
 const root=await page.locator('html').evaluate(el=>getComputedStyle(el).scrollBehavior);
 expect(root).toBe('auto');
 const button=page.locator('.hero .button').first();
 const duration=await button.evaluate(el=>getComputedStyle(el).transitionDuration);
 expect(duration.split(',').every(x=>Number.parseFloat(x)<=0.001)).toBeTruthy();
 await expect(page.locator('#daily .daily-meal')).toHaveCount(3);
});
