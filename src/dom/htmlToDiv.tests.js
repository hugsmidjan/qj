//@flow
import o from 'ospec';
import '../__testing/polyfill-document';
import htmlToDiv from './htmlToDiv';


o.spec('htmlToDiv', () => {

    o('Parses whitespace at beginning and end of HTML', () => {
        const div = htmlToDiv('  <strong>Hi</strong>  ');
        o(div.children.length).equals(1);
        o(div.childNodes.length).equals(3);
    });

    o('Strips out <!DOCTYPE>s', () => {
        const doctypeHTML = '<!DOCTYPE html>';
        const doctypeXHTML = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';
        const doctypeSVG = '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';

        let div;
        div = htmlToDiv(doctypeHTML);
        o(div.childNodes.length).equals(0);
        div = htmlToDiv(doctypeXHTML);
        o(div.childNodes.length).equals(0);
        div = htmlToDiv(doctypeSVG);
        o(div.childNodes.length).equals(0);

        div = htmlToDiv(doctypeHTML+doctypeXHTML);
        o(div.childNodes.length).equals(0);

        div = htmlToDiv(' '+doctypeHTML+' ');
        o(div.childNodes.length).equals(1);
        div = htmlToDiv(' '+doctypeHTML+' '+doctypeXHTML+' Hi <span>There</span>');
        o(div.childNodes.length).equals(2);
        o(div.childNodes[0].textContent).equals('   Hi ');
        o(div.childNodes[1].tagName).equals('SPAN');
    });

    const fullHtml = (
        '<!DOCTYPE html><html lang="fr">' +
            '<head>' +
                '<title>Test</title>' +
                '<link rel="stylesheet" href="styles.css"/>' +
                '<style>p { color: red; }</style>' +
                '<meta name="foo" content="bar" />' +
                '<script>console.error("wat1")</script>' +
            '</head>' +
            '<body>' +
                '<p>Hi</p> ' +
                '<img src="image.png" alt="nice" />  ' +
                '<scriptnot>Hi</scriptnot>' +
                '<script>console.error("wat2")</script>' +
            '</body>' +
        '</html>'
    );
    const metaLevelElms = 'html,head,body,title,link,meta,style,script,img';
    const metaLevelElmList = metaLevelElms.split(',');

    o('Disables <script>s and meta-level Elements', () => {
        const div = htmlToDiv(fullHtml);
        o(div.childNodes.length).equals(1);
        o(div.childNodes[0].tagName).equals('HTML--DISABLED');
        o(div.childNodes[0].lang).equals('fr');
        o(div.querySelectorAll(metaLevelElms).length).equals(0);
        o(div.querySelectorAll('scriptnot').length).equals(1);
        o(div.querySelectorAll('p').length).equals(1);
        metaLevelElmList.forEach((tagName) => {
            const expectedCount = tagName === 'script' ? 2 : 1;
            o(div.querySelectorAll(tagName+'--disabled').length).equals(expectedCount);
        });
    });

    o('Optionally does not disable meta-level Elements', () => {
        const keepAll = metaLevelElmList.reduce((acc, name) => {
            acc['keep'+name] = true;
            return acc;
        }, {});
        const div = htmlToDiv(fullHtml, keepAll);
        o(div.querySelectorAll('html, head, body').length).equals(0);
        o(div.querySelectorAll('html--disabled, head--disabled, body--disabled').length).equals(0);
        o(div.querySelectorAll('title').length).equals(1);
        o(div.querySelectorAll('meta').length).equals(1);
        o(div.querySelectorAll('link').length).equals(1);
        o(div.querySelectorAll('script').length).equals(2);
        o(div.querySelectorAll('img').length).equals(1);
    });

    o('Optionally disable only some meta-level Elements', () => {
        const div = htmlToDiv(fullHtml, {
            keepstyle: true,
            keepscript: true,
            keepimg: true,
        });
        o(div.querySelectorAll('style, script, img').length).equals(4);
        o(div.querySelectorAll('html--disabled, head--disabled, body--disabled, title--disabled, meta--disabled, link--disabled').length).equals(6);
    });


    o('Accepts custom `document` object', () => {
        const customDoc = {
            createElement: () => {
                const div = document.createElement('div');
                div.setAttribute('class', 'custom-div');
                return div;
            },
        };
        const div = htmlToDiv('<strong>Hi</strong>', { document: customDoc });
        o(div.tagName).equals('DIV');
        o(div.className).equals('custom-div');
        o(div.children.length).equals(1);
        o(div.childNodes.length).equals(1);
    });


});