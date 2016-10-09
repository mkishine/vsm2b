import { Vsm2aPage } from './app.po';

describe('vsm2a App', function() {
  let page: Vsm2aPage;

  beforeEach(() => {
    page = new Vsm2aPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
