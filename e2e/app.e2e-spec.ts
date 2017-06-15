import { ContentExplorerPage } from './app.po';

describe('content-explorer App', () => {
  let page: ContentExplorerPage;

  beforeEach(() => {
    page = new ContentExplorerPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
