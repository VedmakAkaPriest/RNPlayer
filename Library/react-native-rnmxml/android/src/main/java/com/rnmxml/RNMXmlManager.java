package com.rnmxml;

import android.util.Base64;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import java.io.FileOutputStream;

import javax.xml.xpath.XPath;
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
//            XPathFactory factory = XPathFactory.newInstance();
//            XPath xPath = factory.newXPath();
//            NodeList shows = (NodeList) xPath.evaluate("/schedule/show", new InputSource(xmlString), XPathConstants.NODESET);
//            for (int i = 0; i < shows.getLength(); i++) {
//                Element show = (Element) shows.item(i);
//                String guestName = xPath.evaluate("guest/name", show);
//                String guestCredit = xPath.evaluate("guest/credit", show);
//                System.out.println(show.getAttribute("weekday") + ", " + show.getAttribute("date") + " - "
//                        + guestName + " (" + guestCredit + ")");
//            }

//            callback.invoke(null, true, filepath);
        } catch (Exception ex) {
            ex.printStackTrace();
            callback.invoke(makeErrorPayload(ex));
        }
    }

    private WritableMap makeErrorPayload(Exception ex) {
        WritableMap error = Arguments.createMap();
        error.putString("message", ex.getMessage());
        return error;
    }
}
