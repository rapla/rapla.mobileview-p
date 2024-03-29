/*--------------------------------------------------------------------------*
 | Copyright (C) 2011 Robert Hoppe			                                |
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

import org.rapla.components.calendarview.Block;
import org.rapla.components.calendarview.html.HTMLWeekView;
import org.rapla.entities.domain.internal.AppointmentImpl;
import org.rapla.entities.storage.RefEntity;
import org.rapla.framework.RaplaContext;
import org.rapla.framework.RaplaContextException;
import org.rapla.plugin.abstractcalendar.AbstractRaplaBlock;

public class HTMLMobileWeekView extends HTMLWeekView {
    @Override
    protected void printBlock(StringBuffer result, int firstEventMarker, Block block) {
        AbstractRaplaBlock raplaBlock = (AbstractRaplaBlock) block;
        // get Appointment for ID
        AppointmentImpl curAppointment = ((AppointmentImpl) raplaBlock.getAppointment());
        
        // Remove the org.rapla we don't need them for GET-Parameter
        String appointmendId = ((RefEntity<?>) curAppointment).getId().toString().replace("org.rapla.entities.domain.Appointment", "");
        String reservationId = ((RefEntity<?>)(curAppointment.getReservation())).getId().toString().replace("org.rapla.entities.domain.Reservation_", "");
        
        RaplaContext raplaContext = raplaBlock.getBuildContext().getServiceManager();
        String curUrl;
        try {
            curUrl = raplaContext.lookup( HTMLMobileWeekViewPage.URL_KEY);
        } catch (RaplaContextException e) {
           throw new IllegalStateException(e.getMessage());
        }
        //result.append("<div class=\"event_block\"" + firstEventMarker + ">");                       
        String blockDetailUrl = curUrl + "&amp;detail=" + reservationId + appointmendId;
        result.append("<a href=\"" + blockDetailUrl + "\">"); 
        result.append(block.toString());
        result.append("</a>\n");
		//result.append("</td>");

        // build ID-String for detail view. Example string: detail=RESERVATIONID_APPOINTMENTID
    }
}
