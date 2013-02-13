/*--------------------------------------------------------------------------*
 | Copyright (C) 2011 Robert Hoppe - http://www.katado.com                  |
 |                                                                          |
 | This program is free software; you can redistribute it and/or modify     |
 | it under the terms of the GNU General Public License as published by the |
 | Free Software Foundation. A copy of the license has been included with   |
 | these distribution in the COPYING file, if not go to www.fsf.org         |
 |                                                                          |
 | As a special exception, you are granted the permissions to link this     |
 | program with every library, which license fulfills the Open Source       |
 | Definition as published by the Open Source Initiative (OSI).             |
 *--------------------------------------------------------------------------*/
package org.rapla.plugin.mobile;

import org.apache.avalon.framework.configuration.Configuration;
import org.apache.avalon.framework.logger.AbstractLogEnabled;
import org.apache.avalon.framework.logger.Logger;
import org.rapla.components.xmlbundle.I18nBundle;
import org.rapla.components.xmlbundle.impl.I18nBundleImpl;
import org.rapla.framework.Container;
import org.rapla.framework.PluginDescriptor;
import org.rapla.framework.StartupEnvironment;
import org.rapla.plugin.RaplaExtensionPoints;
import org.rapla.plugin.RaplaPluginMetaInfo;
import org.rapla.servletpages.RaplaResourcePageGenerator;

public class MobilePlugin extends AbstractLogEnabled implements PluginDescriptor
{
	// Resource file with language definitions
    public static final String RESOURCE_FILE =  MobilePlugin.class.getPackage().getName() + ".MobileResources";
    
    // plugin entry definition
    public static final String PLUGIN_ENTRY = "org.rapla.plugin.mobile";
    
    // set selected
    public static final String HTML_VIEW = PLUGIN_ENTRY + ".selected";
    
    // set plugin class
    public static final String PLUGIN_CLASS = MobilePlugin.class.getName();
    
    // use user colors for appointment blocks?
    public static final String ENABLE_USER_COLOR = "enable_user_color";
   
    // plugin enabled
    static boolean ENABLE_BY_DEFAULT = true;
    
    public MobilePlugin(Logger logger) {
        enableLogging(logger);
    }

    public String toString() {
        return "Mobile optimized View";
    }

    public void provideServices(Container container, Configuration config) {
    	// register select box for enabling user defined colors for appointments
    	container.addContainerProvidedComponent(RaplaExtensionPoints.PLUGIN_OPTION_PANEL_EXTENSION, MobilePluginOption.class.getName(),PLUGIN_CLASS, config);
    	
    	// add resource file in order to get later the language definitions
    	container.addContainerProvidedComponent(I18nBundle.ROLE, I18nBundleImpl.class.getName(), RESOURCE_FILE,I18nBundleImpl.createConfig(RESOURCE_FILE));
        
    	// check if the plugin is enabled
    	if (!config.getAttributeAsBoolean("enabled", ENABLE_BY_DEFAULT)) {
        	return;
        }
        container.addContainerProvidedComponentInstance(PLUGIN_CLASS, Boolean.TRUE);
        
        // is this the Server?
        StartupEnvironment env = container.getStartupEnvironment();
        if (env.getStartupMode() == StartupEnvironment.SERVLET) {
	        try {
	        	// Mobile WEEK_VIEW
	        	container.addContainerProvidedComponent (
	        			RaplaExtensionPoints.CALENDAR_VIEW_EXTENSION
	        			,MobileWeekViewFactory.class.getName()
	        			,MobileWeekViewFactory.MOBILE_WEEK_VIEW
	        			,null
	             );
	        	
		        RaplaResourcePageGenerator resourcePageGenerator = (RaplaResourcePageGenerator)container.getContext().lookup(RaplaExtensionPoints.SERVLET_PAGE_EXTENSION + "/resource");
		        
		        // custom css definitions for the mobile view
		        resourcePageGenerator.registerResource("mobile.css", "text/css", this.getClass().getResource("/org/rapla/plugin/mobile/css/mobile.css")); 
		        
		        // css definitions of the jQuery Mobile Framework
		        resourcePageGenerator.registerResource("jquery.mobile.css", "text/css", this.getClass().getResource("/org/rapla/plugin/mobile/css/jquery.mobile.css"));
		        
		        // jQuery javascript library, the base for jQuery mobile
		        resourcePageGenerator.registerResource("jquery.min.js", "text/javascript", this.getClass().getResource("/org/rapla/plugin/mobile/js/jquery.min.js")); 
		        
		        // Global preferences for jQuery Mobile
		        resourcePageGenerator.registerResource("jquery.mobile.pref.js", "text/javascript", this.getClass().getResource("/org/rapla/plugin/mobile/js/jquery.mobile.pref.js"));
		        
		        // jQuery Mobile Framework
		        resourcePageGenerator.registerResource("jquery.mobile.js", "text/javascript", this.getClass().getResource("/org/rapla/plugin/mobile/js/jquery.mobile.js"));
		        
		        // jQuery Mobile Plugin scroll view to realiese the horizontal scroll
		        resourcePageGenerator.registerResource("jquery.mobile.scrollview.js", "text/javascript", this.getClass().getResource("/org/rapla/plugin/mobile/js/jquery.mobile.scrollview.js"));
		        
		        // jQuery easing effects
		        resourcePageGenerator.registerResource("jquery.easing.js", "text/javascript", this.getClass().getResource("/org/rapla/plugin/mobile/js/jquery.easing.js"));
		        
		        // jQuery mobile Plugin datebox date picker 
		        resourcePageGenerator.registerResource("jquery.mobile.datebox.min.js", "text/javascript", this.getClass().getResource("/org/rapla/plugin/mobile/js/jquery.mobile.datebox.min.js"));
		        
		        // custom Javascript functions to handle the functionality
		        resourcePageGenerator.registerResource("script.js", "text/javascript", this.getClass().getResource("/org/rapla/plugin/mobile/js/script.js"));
		        	        
		        // register needed images for the jQuery mobile Framework
		        resourcePageGenerator.registerResource("ajax-loader.png", "text/plain", this.getClass().getResource("/org/rapla/plugin/mobile/images/ajax-loader.png"));
		        resourcePageGenerator.registerResource("ajax-loader.gif", "text/plain", this.getClass().getResource("/org/rapla/plugin/mobile/images/ajax-loader.gif"));
		        resourcePageGenerator.registerResource("icons-18-black.png", "text/plain", this.getClass().getResource("/org/rapla/plugin/mobile/images/icons-18-black.png"));
		        resourcePageGenerator.registerResource("icons-36-black.png", "text/plain", this.getClass().getResource("/org/rapla/plugin/mobile/images/icons-36-black.png"));
		        resourcePageGenerator.registerResource("icons-18-white.png", "text/plain", this.getClass().getResource("/org/rapla/plugin/mobile/images/icons-18-white.png"));
		        resourcePageGenerator.registerResource("icons-36-white.png", "text/plain", this.getClass().getResource("/org/rapla/plugin/mobile/images/icons-36-white.png"));
		        
		        
		        if (!config.getAttributeAsBoolean("enabled", ENABLE_BY_DEFAULT)) {
		        	return;
		        }
		
		        // add configuration in order to make the user able to enable/disable the plugin
		        container.addContainerProvidedComponentInstance(PLUGIN_CLASS, Boolean.TRUE);
		        container.addContainerProvidedComponent(RaplaExtensionPoints.SERVLET_PAGE_EXTENSION, CalendarPageGenerator.class.getName(), "mobile", config);
	        } catch (Exception ex) {
	            getLogger().error("Could not initialize mobile plugin on server" , ex);
	        }
        }
    }

    public Object getPluginMetaInfos(String key)
    {
        if (RaplaPluginMetaInfo.METAINFO_PLUGIN_ENABLED_BY_DEFAULT.equals(key)) {
            return new Boolean( ENABLE_BY_DEFAULT );
        }
        return null;
    }


}

