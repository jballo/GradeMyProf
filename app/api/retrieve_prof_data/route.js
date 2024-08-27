import puppeteer from "puppeteer-core";
import { NextResponse } from "next/server";

async function connectBrowser(maxRetries = 3) {
    let attempt = 0;
    while (attempt < maxRetries) {
        try {
            const auth = process.env.BRIGHTDATA_USERNAME + ':' + process.env.BRIGHTDATA_PASSWORD;
            const browser = await puppeteer.connect({
                browserWSEndpoint: `wss://${auth}@brd.superproxy.io:9222`,
                headless: true,
                args: ['--disable-gpu', '--disable-setuid-sandbox', '--no-sandbox', '--no-zygote', '--single-process'],
            });
            return browser;
        } catch (error) {
            attempt++;
            console.error(`Browser connection attempt ${attempt} failed:`, error);
            if (attempt >= maxRetries) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
    }
}

async function scrapeProfessorUrl(professorUrl, maxRetries = 3) {
    let browser;
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            browser = await connectBrowser();

            const page = await browser.newPage();
            page.setDefaultNavigationTimeout(3 * 60 * 1000);

            // Clear cache and disable image/media loading
            await page.setCacheEnabled(false);
            await page.setRequestInterception(true);
            page.on('request', (req) => {
                if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) {
                    req.abort();
                } else {
                    req.continue();
                }
            });

            await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36');

            // Navigate to the URL with a shorter timeout
            await page.goto(professorUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
            await page.waitForSelector('.NameTitle__Name-dowf0z-0.cfjPUG span');
            await page.waitForSelector('#ratingsList');

            // Extract the relevant part of the page
            const data = await page.evaluate(() => {
                const firstName = document.querySelector('.NameTitle__Name-dowf0z-0.cfjPUG span').innerText;
                const rating = document.querySelector('.RatingValue__Numerator-qw8sqy-2.liyUjw').innerText;

                const reviewElements = document.querySelectorAll('#ratingsList > li');
                const reviews = [];
                reviewElements.forEach(reviewElement => {
                    const className = reviewElement.querySelector('.RatingHeader__StyledClass-sc-1dlkqw1-3')?.innerText.trim();
                    const date = reviewElement.querySelector('.TimeStamp__StyledTimeStamp-sc-9q2r30-0')?.innerText.trim();
                    const quality = reviewElement.querySelector('.CardNumRating__CardNumRatingNumber-sc-17t4b9u-2.bUneqk')?.innerText.trim();
                    const difficulty = reviewElement.querySelector('.CardNumRating__CardNumRatingNumber-sc-17t4b9u-2.cDKJcc')?.innerText.trim();
                    const comment = reviewElement.querySelector('.Comments__StyledComments-dzzyvm-0')?.innerText.trim();
                    if (className && date && quality && difficulty && comment) {
                        reviews.push({ className, date, quality, difficulty, comment });
                    }
                });

                return { firstName, rating, reviews };

            });
            console.log(data);

            return new NextResponse({ status: 200, body: JSON.stringify(data) });
        } catch (error) {
            attempt++;
            console.error(`Attempt ${attempt} failed:`, error);

            if (attempt >= maxRetries) {
                return new NextResponse({ status: 500, statusText: 'Failed to scrape professor URL' });
            }

            // Increase delay between retries to allow recovery
            await new Promise(resolve => setTimeout(resolve, 3000 * attempt));
        } finally {
            if (browser) {
                try {
                    await browser.close();
                } catch (error) {
                    console.error('Error closing browser:', error);
                }
            }
        }
    }
}

export async function POST(req) {
    const data = await req.json();
    const professorUrl = data.professorUrl;
    console.log("Received data: ", data);
    console.log("Professor Url: ", professorUrl);

    return await scrapeProfessorUrl(professorUrl);
}
