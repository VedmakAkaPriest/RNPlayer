package com.rnmxml;

import android.util.Base64;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import java.io.FileOutputStream;

import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathFactory;

public class RNMXmlManager extends ReactContextBaseJavaModule {

    public RNMXmlManager(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "RNMXml";
    }

    @ReactMethod
    public void queryHtml(String xmlString, ReadableArray queries, Callback callback) {
        try {
            WritableArray results = Arguments.createArray();
            for (int i = 0; i < queries.size(); i++) {
                results.pushArray(xpathQuery(xmlString, queries.getString(i)));
            }
            callback.invoke(null, true, results);
        } catch (Exception ex) {
            ex.printStackTrace();
            callback.invoke(makeErrorPayload(ex));
        }
    }

    @ReactMethod
    public void queryXml(String xmlString, ReadableArray queries, Callback callback) {
        try {
            WritableArray results = Arguments.createArray();
            for (int i = 0; i < queries.size(); i++) {
                results.pushArray(xpathQuery(xmlString, queries.getString(i)));
            }
            callback.invoke(null, true, results);
        } catch (Exception ex) {
            ex.printStackTrace();
            callback.invoke(makeErrorPayload(ex));
        }
    }

    private WritableArray xpathQuery(String xmlString, String query) throws Exception {
        WritableArray results = Arguments.createArray();
        XPathFactory factory = XPathFactory.newInstance();
        XPath xPath = factory.newXPath();
        NodeList shows = (NodeList) xPath.evaluate(query, new InputSource(xmlString), XPathConstants.NODESET);
        for (int i = 0; i < shows.getLength(); i++) {
            Element show = (Element) shows.item(i);
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
