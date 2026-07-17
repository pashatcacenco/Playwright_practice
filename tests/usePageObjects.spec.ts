import { test } from 'playwright/test'
import { NavigationPage } from '../page-objects/navigationPage'     

// navigate the page to the base url before each test
test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/')
})

test ('navigate to form page', async ({ page }) => {
    const navigateTo = new NavigationPage(page)
    await navigateTo.formLayoutsPage()
})