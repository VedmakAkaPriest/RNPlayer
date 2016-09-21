package com.rnmxml;


import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import org.htmlcleaner.CleanerProperties;
import org.htmlcleaner.CompactXmlSerializer;
import org.htmlcleaner.DomSerializer;
import org.htmlcleaner.HtmlCleaner;
import org.htmlcleaner.TagNode;
import org.htmlcleaner.XmlSerializer;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import java.io.StringReader;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathFactory;

public class RNMXml extends ReactContextBaseJavaModule {

    public RNMXml(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "RNMXml";
    }

    @ReactMethod
    public void queryHtml(String htmlString, ReadableArray queries, Promise promise) {
        try {
            HtmlCleaner htmlCleaner = new HtmlCleaner();
            CleanerProperties cleanerProperties = htmlCleaner.getProperties();
            cleanerProperties.setOmitComments(true);
            cleanerProperties.setTranslateSpecialEntities(false);
            cleanerProperties.setRecognizeUnicodeChars(false);
            cleanerProperties.setOmitUnknownTags(true);
            cleanerProperties.setOmitDoctypeDeclaration(true);
            cleanerProperties.setOmitXmlDeclaration(false);
            cleanerProperties.setUseCdataForScriptAndStyle(true);

            TagNode tagNode = htmlCleaner.clean(htmlString);
            tagNode.removeAttribute("xmlns:xml");
            XmlSerializer xmlSerializer = new CompactXmlSerializer(cleanerProperties);
            String cleanedPage = xmlSerializer.getAsString(tagNode, "UTF-8");

            queryXml(cleanedPage, queries, promise);

//            WritableArray results = Arguments.createArray();
//            for (int i = 0; i < queries.size(); i++) {
//                results.pushArray(xpathQuery(doc, queries.getString(i)));
//            }
//            promise.resolve(results);
        } catch (Exception ex) {
            ex.printStackTrace();
            promise.reject(ex);
        }
    }

    @ReactMethod
    public void queryXml(String xmlString, ReadableArray queries, Promise promise) {
        try {
            InputSource source = new InputSource(new StringReader(xmlString));
            Document doc = DocumentBuilderFactory.newInstance().newDocumentBuilder().parse(source);
            doc.getDocumentElement().normalize();

            WritableArray results = Arguments.createArray();
            for (int i = 0; i < queries.size(); i++) {
                results.pushArray(xpathQuery(doc, queries.getString(i)));
            }
            promise.resolve(results);
        } catch (Exception ex) {
            ex.printStackTrace();
            promise.reject(ex);
        }
    }

    private WritableArray xpathHtmlQuery(TagNode node, String query) throws Exception {
        WritableArray results = Arguments.createArray();

        Object[] shows = node.evaluateXPath(query);
        for (int i = 0; i < shows.length; i++) {
            TagNode show = (TagNode) shows[i];
            results.pushString(show.getText().toString());
        }
        return results;
    }

    private WritableArray xpathQuery(Object source, String query) throws Exception {
        WritableArray results = Arguments.createArray();
        XPathFactory factory = XPathFactory.newInstance();
        XPath xPath = factory.newXPath();
        NodeList shows = (NodeList) xPath.evaluate(query, source, XPathConstants.NODESET);
        for (int i = 0; i < shows.getLength(); i++) {
            Node show = (Node) shows.item(i);
            results.pushString(show.getTextContent());
        }
        return results;
    }

    private WritableMap makeErrorPayload(Exception ex) {
        WritableMap error = Arguments.createMap();
        error.putString("message", ex.getMessage());
        return error;
    }
}
