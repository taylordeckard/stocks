import { Injectable } from '@angular/core';
import * as $ from 'jquery';

@Injectable({
  providedIn: 'root',
})
export class YahooService {

  public async getStats (symbol: string) {
    const percentInsiders = await this.getInsiderPercentage(symbol);
    const summary = await this.getSummary(symbol);
    const insights = await this.getInsights(symbol);
    return {
      percentInsiders,
      ...insights,
      ...summary,
    };
  }

  private async getInsiderPercentage (symbol: string) {
    const url = `https://finance.yahoo.com/quote/${symbol}/holders?p=${symbol}`;
    try {
      const response = await fetch(url);
      const htmlText = await response.text();
      const page = $(htmlText.replace(/src=.*?>/g, ''));
      const text = page.find('[data-test="holder-summary"] td').first().text();

      return Number(text.replace('%', ''));
    } catch (e) {
      return '';
    }
  }

  private async getSummary (symbol: string) {
    const url = `https://finance.yahoo.com/quote/${symbol}?p=${symbol}`;
    try {
      const response = await fetch(url);
      const page = await response.text();
      const doc = $(page.replace(/src=.*?>/g, ''));

      const q = doc
        .find('#quote-header-info > div:nth-child(3) > div > div > span')
        .first()
        .text()
        .replace(',', '');
      const quote = q ? Number(q) : 0;
      console.log(quote);
      const pe = Number(doc
        .find('[data-test="PE_RATIO-value"]').text()
        .replace(',', '')
        .replace('N/A', ''));
      const eps = Number(doc
        .find('[data-test="EPS_RATIO-value"]').text());
      const fairValue = doc
        .find('[data-yaft-module="tdv2-applet-ResearchQuoteStatsInsights"]')
        .find('> div > div:nth-child(2) > div:nth-child(2)')
        .text();
      const dy = doc
        .find('[data-test="DIVIDEND_AND_YIELD-value"]')
        .text()
        .match(/\(((\d|\.)+)%\)/)?.[1];
      const dividendYield = dy ? Number(dy) : 0;

      const embedded = this.getEmbeddedSummary(page);
      
      return {
        ...embedded,
        dividendYield,
        eps,
        fairValue,
        pe,
        quote,
      }
    } catch (e) {
      return {};
    }
  }

  private async getInsights (symbol: string) {
    const url = `https://query1.finance.yahoo.com/ws/insights/v2/finance/insights?lang=en-US&region=US&symbol=${symbol}&getAllResearchReports=true&reportsCount=2&corsDomain=finance.yahoo.com`;
    try {
      const response = await fetch(url);
      const data = await response.json();

      return {
        stopLoss: data?.finance?.result?.instrumentInfo?.keyTechnicals?.stopLoss,
        recommendation: data?.finance?.result?.recommendation?.rating,
      };
    } catch (e) {
      return {};
    }
  }

  private getEmbeddedSummary (page: string) {
    const embeddedText = page.match(/root.App.main = ({.*});/)?.[1];
    let embedded: any = {}
    try { 
      embedded = JSON.parse(embeddedText);
    } catch (e) { }

    const stores = embedded?.context?.dispatcher?.stores;
    const yahooAdvice = this.getYahooAdvice(stores?.QuoteSummaryStore?.recommendationTrend?.trend);
    const esg = stores?.QuoteSummaryStore?.esgScores?.totalEsg?.raw;
    console.log(stores);

    return {
      esg,
      yahooAdvice,
    };
  }

  private getYahooAdvice (recs: any[]) {
    const currentM = recs?.[0];
    const strongBuy = currentM?.strongBuy || 0;
    const buy = currentM?.buy || 0;
    const hold = currentM?.hold || 0;
    const sell = currentM?.sell || 0;
    const strongSell = currentM?.strongSell || 0;
    const numAnalysts = strongSell + sell + hold + buy + strongBuy;
    if (!numAnalysts) {
      return 0;
    }
    return ((strongBuy * 1) + (buy * 2) + (hold * 3) + (sell * 4) + (strongSell * 5))
      / (numAnalysts);
  }

}
