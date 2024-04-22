import Handlebars = require("handlebars");


export class HandlebarsWrapper {

    public static getTemplate(pName: string, pContext: any): HandlebarsTemplateDelegate {
        return Handlebars.compile(pName, pContext);
    }
}