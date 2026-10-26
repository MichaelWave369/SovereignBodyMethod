import {test,expect} from '@playwright/test';

const home='./';
const recipeCards=page=>page.locator('#meals .meal-recipe-card');
const dayPicker=page=>page.locator('#daily .daily-day-grid');

test('a public Day 12 link shows three original meals, correct shared day and zero imported checkmarks',async({page})=>{
 await page.goto('?day=12#daily');
 await expect(page.locator('#daily .daily-picker-title h3')).toContainText('Day 12');
 await expect(dayPicker(page).getByRole('button',{name:'Select shared day 12'})).toHaveAttribute('aria-pressed','true');
 await expect(page.locator('#daily .daily-meal')).toHaveCount(3);
 await expect(page.locator('#daily .daily-water-content')).toBeVisible();
 await expect(page.locator('#daily .daily-progress strong').first()).toContainText('0');
 await expect(page.locator('#meals .meal-day-view')).toContainText('Day 12');
 await expect(page.locator('#movement .movement-day-head h3')).toContainText('12');
 const shared=page.locator('#daily .share-day input');
 await expect(shared).toHaveValue(/day=12#daily$/);
 await expect(shared).not.toHaveValue(/progress|favorite|price|bookmark/);
 await dayPicker(page).getByRole('button',{name:'Select shared day 13'}).click();
 await expect(page).not.toHaveURL(/\?day=12/);
 await expect(page.locator('#daily .daily-picker-title h3')).toContainText('Day 13');
});

test('a public Day 30 link never invents a 29th or 30th original water entry',async({page})=>{
 await page.goto('?day=30#daily');
 await expect(page.locator('#daily .daily-picker-title h3')).toContainText('Day 30');
 await expect(page.locator('#daily .daily-meal')).toHaveCount(3);
 await expect(page.locator('#daily .daily-water')).toContainText('ends at Day 28');
 await expect(page.locator('#daily .daily-checks input[type=checkbox]')).toHaveCount(2);
 await expect(page.locator('#hydration')).toContainText('ends at Day 28');
});

test('original recipes, saved favorites and private Shelf work together',async({page})=>{
 await page.goto(home);
 await expect(recipeCards(page)).toHaveCount(3);
 const first=recipeCards(page).first();
 const favorite=first.getByRole('button',{name:/Save to favorites/});
 await favorite.click();
 await expect(first.getByRole('button',{name:/Remove from favorites/})).toHaveAttribute('aria-pressed','true');
 await expect(page.locator('#my-shelf .shelf-card')).toHaveCount(1);
 await page.locator('#my-shelf .shelf-card').first().getByRole('button',{name:/Open original recipe/}).click();
 await expect(page.locator('#meals .meal-favorites-view .meal-recipe-details').first()).toBeVisible();
 await expect(page.locator('#my-shelf .shelf-summary')).toContainText('Favorite recipes');
});

test('a real full-text search opens original manuscript and saves reading place',async({page})=>{
 await page.goto(home);
 await expect(page.locator('.archive-status')).toContainText('21 of 21 canonical originals');
 const search=page.getByRole('searchbox',{name:'Search original library'});
 await search.fill('breathing');
 await expect(page.locator('.archive-atlas-hit').first()).toBeVisible({timeout:20_000});
 await page.locator('.archive-atlas-hit').first().click();
 const reader=page.getByRole('dialog',{name:/Original manuscript/});
 await expect(reader).toBeVisible();
 await expect(reader.locator('.archive-manuscript')).toBeVisible();
 await reader.getByRole('button',{name:'Save my place'}).click();
 await expect(reader.getByRole('status')).toContainText('Saved your current reading place');
 await reader.getByRole('button',{name:'Close original manuscript'}).click();
 await expect(reader).toHaveCount(0);
});

test('mobile navigation reaches Start Here and original Word downloads are real files',async({page,request})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto(home);
 const menu=page.locator('.mobile-navigation');
 await expect(menu.locator('summary')).toBeVisible();
 await menu.locator('summary').click();
 await menu.getByRole('link',{name:'Start here'}).click();
 await expect(page).toHaveURL(/#start-here$/);
 await expect(page.locator('#start-here')).toBeVisible();
 const link=page.locator('.release-entry a[download]').first();
 const href=await link.getAttribute('href');
 expect(href).toMatch(/\/SovereignBodyMethod\/library\/originals\/[a-z0-9-]+\.docx$/);
 const file=await request.get(href);
 expect(file.ok()).toBeTruthy();
 const bytes=await file.body();
 expect(bytes.subarray(0,2).toString('hex')).toBe('504b');
 expect(bytes.length).toBeGreaterThan(500);
});

test('offline core can reload the real built site after its service worker prepares',async({page,context})=>{
 await page.goto(home);
 await expect(page.locator('#offline-access')).toBeVisible();
 await expect(page.locator('#offline-access')).toContainText('Offline reading ready',{timeout:30_000});
 await context.setOffline(true);
 await page.reload({waitUntil:'domcontentloaded'});
 await expect(page.getByRole('heading',{level:1})).toContainText('Your body');
 await expect(page.locator('#daily .daily-meal')).toHaveCount(3);
 await expect(page.locator('.archive-status')).toContainText('21 of 21 canonical originals');
 await context.setOffline(false);
});
