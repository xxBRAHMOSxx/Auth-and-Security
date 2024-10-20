import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js"
import { mailtrapClient, sender } from "./mailtrap.config.js"

export const sendVerificationEmail = async (email,verificationToken) => {
    const recipient = [{email}]

    try {
        const response = await mailtrapClient.send({
            from:sender,
            to:recipient,
            subject:"Account Verification",
            html:VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",verificationToken),
            category:"Email Verification"
        })
        console.log("Email sent successfully",response);
        
    } catch (error) {
        console.log(error)
        throw new Error(`Email could not be sent, ${error}`)
    }

}

export const sendWelcomeEmail = async (email,name) => {
    const recipient = [{email}]

    try {
        const response = await mailtrapClient.send({
            from:sender,
            to:recipient,
            template_uuid:"6fdf14ce-b52f-4de6-8ba4-b0ece9560ff9",
            template_variables:{    
                "company_info_name": "Auth company",
                "name": name
            },
        })
        console.log(" welcome Email sent successfully",response);
        
    } catch (error) {
        console.log(error)
        throw new Error(`Email could not be sent, ${error}`)
    }
}

export const sendPasswordResetEmail = async (email,resetURL) => {
    const recipient = [{email}]

    try {
        const response = await mailtrapClient.send({
            from:sender,
            to:recipient,
            subject:"Password Reset",
            html:PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",resetURL),
            category:"Password Reset"
        })
        console.log("Email sent successfully",response);
        
    } catch (error) {
        console.log(error)
        throw new Error(`Email could not be sent, ${error}`)
    }

}

export const sendResetSuccessEmail = async (email) => {
    const recipient = [{email}]

    try {
        const response = await mailtrapClient.send({
            from:sender,
            to:recipient,
            subject:"Password Reset",
            html:PASSWORD_RESET_SUCCESS_TEMPLATE,
            category:"Password Reset"
        })
        console.log("Email sent successfully",response);
        
    } catch (error) {
        console.log(error)
        throw new Error(`Email could not be sent, ${error}`)
    }

}   