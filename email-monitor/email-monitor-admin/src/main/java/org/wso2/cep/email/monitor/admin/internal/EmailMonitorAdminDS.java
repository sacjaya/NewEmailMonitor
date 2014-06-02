package org.wso2.cep.email.monitor.admin.internal;

import org.wso2.cep.email.monitor.EmailMonitorServiceInterface;

/**
 * this class is used to get the EmailMonitorServiceInterface service. it is used to send the
 * requests received from the Admin service to real EmailMonitorService
 *
 * @scr.component name="EmailMonitorAdmin.component" immediate="true"
 * @scr.reference name="emailmonitor.service"
 * interface="org.wso2.cep.email.monitor.EmailMonitorServiceInterface" cardinality="1..1"
 * policy="dynamic" bind="setEmailMonitorService" unbind="unsetEmailMonitorService"
 */
public class EmailMonitorAdminDS {


    protected void setEmailMonitorService(EmailMonitorServiceInterface emailMonitorService) {
        EmailMonitorAdminValueHolder.getInstance().registerEmailMonitorService(emailMonitorService);
    }

    protected void unsetEmailMonitorService(EmailMonitorServiceInterface emailMonitorServiceInterface) {
        EmailMonitorAdminValueHolder.getInstance().unregisterEmailMonitorService();
    }

}
