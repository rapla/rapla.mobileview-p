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
package org.rapla.plugin.mobile.server;

import org.rapla.facade.CalendarModel;
import org.rapla.facade.RaplaComponent;
import org.rapla.framework.RaplaContext;
import org.rapla.framework.RaplaException;
import org.rapla.plugin.abstractcalendar.server.HTMLViewFactory;
import org.rapla.servletpages.RaplaPageGenerator;

public class MobileWeekViewFactory extends RaplaComponent implements HTMLViewFactory
{
    public MobileWeekViewFactory( RaplaContext context ) 
    {
        super( context );
    }

    public final static String MOBILE_WEEK_VIEW = "mobile_week";

    public RaplaPageGenerator createHTMLView(RaplaContext context, CalendarModel model) throws RaplaException
    {
        return new HTMLMobileWeekViewPage( context,  model);
    }

    public String getViewId()
    {
        return MOBILE_WEEK_VIEW;
    }

    public String getName()
    {
        return getString(MOBILE_WEEK_VIEW);
    }

  
}

