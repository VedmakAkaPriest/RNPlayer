package com.rnplayer;

import android.support.annotation.NonNull;

import java.util.Arrays;
import java.util.List;

import com.facebook.react.ReactPackage;
import com.reactnativenavigation.NavigationApplication;

import com.brentvatne.react.ReactVideoPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.rnfs.RNFSPackage;

public class MApplication extends NavigationApplication {
    @Override
    public boolean isDebug() {
        // Make sure you are using BuildConfig from your own application
        return BuildConfig.DEBUG;
    }

    @NonNull
    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
        // Add the packages you require here.
        // No need to add RnnPackage and MainReactPackage
        return Arrays.<ReactPackage>asList(
                new ReactVideoPackage()
                , new VectorIconsPackage()
                , new RNFSPackage()
        );
    }
}
