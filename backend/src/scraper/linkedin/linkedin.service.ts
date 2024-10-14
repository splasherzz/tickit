import { Injectable } from '@nestjs/common';

import { Builder, By, until } from 'selenium-webdriver';
import * as cheerio from 'cheerio';
import * as chrome from 'selenium-webdriver/chrome';

export class Job {
    position: string;
    details: string;
    seniority: string;
    employment: string;
    jobFunction: string;
    industries: string;

    constructor(
        position: string, 
        details: string, 
        seniority: string,
        employment: string,
        jobFunction: string,
        industries: string,
    ) {
        this.position = position;
        this.details = details;
        this.seniority = seniority;
        this.employment = employment;
        this.jobFunction = jobFunction;
        this.industries = industries;
    }
}

export class Scraper {
    private driver: any;

    constructor() {
        this.driver = new Builder().forBrowser('chrome').setChromeOptions(this._getChromeOptions()).build();
    }

    private _getChromeOptions(): chrome.Options {
        const options = new chrome.Options();
        options.addArguments('--headless=new');
        options.addArguments('--log-level=3');
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');
        options.addArguments('--incognito');
        options.addArguments('--disable-gpu');
        options.addArguments("--disable-blink-features")
        options.addArguments("--disable-blink-features=AutomationControlled")
        return options;
    }

    public async getLinkedInJobDetails(url: string, retries: number): Promise<Job> {
        await this.driver.get(url);
        const wait = this.driver.wait(until.elementLocated(By.css('[class="t-24 job-details-jobs-unified-top-card__job-title"]')), 3000);
// 
//      const currentUrl = await this.driver.getCurrentUrl();
//      if (currentUrl.includes("authwall")) {
//      
//      }

        try {
            const closeBtn = await wait;
            if (closeBtn) {
                await closeBtn.click();
            }
        } catch (error) {
            if (retries > 0) {
                console.log('No login modal found. Retrying...')
                return await this.getLinkedInJobDetails(url, retries-1);
            } else {
                console.log('No login modal found. Assuming that things are working fine.');
            }
        }

        const pageSource = await this.driver.getPageSource();
        const $ = cheerio.load(pageSource);

        const topcardLogo = $('a[data-tracking-control-name="public_jobs_topcard_logo"]').first();
        const position = topcardLogo.next()
                            .find('h1')
                            .text();
        const details = $('section.show-more-less-html')
                            .first()
                            .find('div')
                            .first()
                            .text()
                            .trim()
                            .replace('Job Summary', '')
                            .replaceAll('\n', ' ');

        const jobCriteria = Array.from($('ul.description__job-criteria-list').first().find('li'))
            .map((el, i) => {
                const criteriaTitle = $(el).find('h3.description__job-criteria-subheader').text().trim();
                const criteriaValue = $(el).find('span.description__job-criteria-text').text().trim();
                return [criteriaTitle, criteriaValue]
            }).reduce((res, current) => { res[current[0]] = current[1]; return res }, {});

        console.log("what i got", position, details, jobCriteria)

        return new Job(
            position, 
            details,
            jobCriteria['Seniority level'],
            jobCriteria['Employment type'],
            jobCriteria['Job function'],
            jobCriteria['Industries']
        )
    }

    public async close(): Promise<void> {
        await this.driver.quit();
    }
}

@Injectable()
export class LinkedInService {
  async test(url) {
    const scraper = new Scraper();
    const jobDetails = await scraper.getLinkedInJobDetails(url, 3);
    console.log("job", jobDetails)
    await scraper.close();
    return jobDetails;
  }
}
