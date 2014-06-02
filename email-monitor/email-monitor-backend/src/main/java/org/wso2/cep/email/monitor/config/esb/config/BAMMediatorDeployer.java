package org.wso2.cep.email.monitor.config.esb.config;

import org.apache.axis2.AxisFault;
import org.apache.log4j.Logger;
import org.wso2.carbon.mediator.bam.config.stub.BAMMediatorConfigAdminStub;
import org.wso2.carbon.utils.CarbonUtils;
import org.wso2.cep.email.monitor.util.EmailMonitorConstants;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.rmi.RemoteException;


public class BAMMediatorDeployer {


    private static Logger logger = Logger.getLogger(BAMMediatorDeployer.class);
    private BAMMediatorConfigAdminStub stub;


    public BAMMediatorDeployer(String ip, String port) {
        String endPoint = EmailMonitorConstants.PROTOCOL + ip + ":" + port + EmailMonitorConstants.SERVICES + EmailMonitorConstants.BAM_MEDIATOR_ADMIN_SERVICE;

       try {
            stub = new BAMMediatorConfigAdminStub(endPoint);
        } catch (AxisFault axisFault) {
            logger.error(axisFault.getMessage());
        }



    }

    public void addBAMServerProfile(String userName, String password, String CEPServerUserName, String CEPServerPassword, String CEPServerIP ,String CEPServerPort){

        CarbonUtils.setBasicAccessSecurityHeaders(userName, password, stub._getServiceClient());

        String content = "";

        InputStream is = null;
        BufferedReader br = null;
        String line;

        is = ProxyDeployer.class.getResourceAsStream(EmailMonitorConstants.BAM_SERVER_PROFILE_CONFIGURATION_PATH);
        br = new BufferedReader(new InputStreamReader(is));
        try {
            while (null != (line = br.readLine())) {
                content = content + line;
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        content = content.replace(EmailMonitorConstants.CEP_SERVER_USER_NAME,CEPServerUserName);
        content = content.replace(EmailMonitorConstants.CEP_SERVER_IP,CEPServerIP);
        content = content.replace(EmailMonitorConstants.CEP_SERVER_PORT,CEPServerPort);

//        content.replace(EmailMonitorConstants.CEP_SERVER_ENCRYPTED_PASSWORD,CEPServerPassword);

        try {
            stub.saveResourceString(content,EmailMonitorConstants.BAM_SERVER_PROFILE_NAME);
        } catch (RemoteException e) {
           logger.error(e.getMessage());
        }


    }



}

