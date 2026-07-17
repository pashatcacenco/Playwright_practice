import { group } from 'console'
import { Page } from 'playwright/test'

export class NavigationPage {

    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async formLayoutsPage() {
        await this.selectGroupMenuItem('Forms')
        await this.page.getByText('Form Layouts').click()
        
    }

    async datepickerPage(){
    await this.selectGroupMenuItem('Forms')
    await this.page.waitForTimeout(1000) // Wait  for 1 second to ensure the menu is expanded
    await this.page.getByText('Datepicker').click()
}

    async smartTablePage(){
    await this.selectGroupMenuItem('Tables & Data')
    await this.page.getByText('Smart Table').click()
}

    async toastrPage(){
    await this.selectGroupMenuItem('Modal & Overlays')
    await this.page.getByText('Toastr').click()
}

    async tooltipPage(){
    await this.selectGroupMenuItem('Modal & Overlays')
    await this.page.getByText('Tooltip').click()
    }
    private async selectGroupMenuItem(groupItemTitle: string) {
        const groupMenuItem = this.page.getByTitle(groupItemTitle)
        const expandState = await groupMenuItem.getAttribute('aria-expanded')
        if (expandState == 'false') {
            await groupMenuItem.click()
        }
    }
}