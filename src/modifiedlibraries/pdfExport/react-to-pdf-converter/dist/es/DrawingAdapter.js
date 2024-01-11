import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
var defaultFileName = 'export.pdf';
var defaultCreator = 'PDF Generator';
/**
 * @hidden
 */
var DrawingAdapter = /** @class */ (function () {
    function DrawingAdapter(drawDOM, exportPDF, saveAs, domElement, options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        this.drawDOM = drawDOM;
        this.exportPDF = exportPDF;
        this.saveAs = saveAs;
        this.domElement = domElement;
        this.options = options;
        this.convertPageTemplateToHtml = function (pageContext) {
            var pageTemplateContent = ReactDOMServer.renderToStaticMarkup(React.createElement(_this.options.pageTemplate, {
                pageNum: pageContext.pageNum, totalPages: pageContext.totalPages
            }));
            return "<span>" + pageTemplateContent + "</span>";
        };
    }
    DrawingAdapter.prototype.savePDF = function (callback) {
        var _this = this;
        var savePromise = this.drawDOM(this.domElement, this.getDrawOptions())
            .then(function (group) { return _this.exportPDF(group, _this.getPDFOptions()); })
            .then(function (dataUri) { return _this.saveAs(dataUri, _this.options.fileName || defaultFileName, _this.getSaveOptions()); });
        if (callback) {
            savePromise.then(callback, callback);
        }
    };
    DrawingAdapter.prototype.getDrawOptions = function () {
        return {
            avoidLinks: this.options.avoidLinks,
            forcePageBreak: this.options.forcePageBreak,
            keepTogether: this.options.keepTogether,
            margin: this.options.margin,
            paperSize: this.options.paperSize,
            landscape: this.options.landscape,
            repeatHeaders: this.options.repeatHeaders,
            scale: this.options.scale,
            template: this.options.pageTemplate && this.convertPageTemplateToHtml
        };
    };
    DrawingAdapter.prototype.getPDFOptions = function () {
        return {
            author: this.options.author,
            creator: this.options.creator || defaultCreator,
            date: this.options.date,
            imgDPI: this.options.imageResolution,
            keywords: this.options.keywords,
            landscape: this.options.landscape,
            margin: this.options.margin,
            multiPage: true,
            paperSize: this.options.paperSize,
            producer: this.options.producer,
            subject: this.options.subject,
            title: this.options.title
        };
    };
    DrawingAdapter.prototype.getSaveOptions = function () {
        return {
            forceProxy: this.options.forceProxy,
            proxyData: this.options.proxyData,
            proxyTarget: this.options.proxyTarget,
            proxyURL: this.options.proxyURL
        };
    };
    return DrawingAdapter;
}());
export default DrawingAdapter;
