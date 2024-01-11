import { toast } from "react-hot-toast"
export const ActivityFormValidationsFunctions = {
    DEFAULT: function(formFields){

        let { subject, buyingDesposition, appointmentStatus} = formFields;
        // console.log("form files",formFields)

        if (!subject) {
            toast.error('Fill Subject Fields!')
            return false
        }
        else if (!buyingDesposition && !appointmentStatus) {
            toast.error('Fill Buying Deposition/Appointment status fields!')
            return false
        }
        else {
              return true
        }
    },
    FORM1: function(formFields){

        let { conversationWith,name,buyingDesposition,languageIssue,knownLanguages,followUpDateTime,comments} = formFields;
        // console.log("knownLanguages=================",knownLanguages)
        // console.log("formFields inside form1",formFields)

        if (!conversationWith) {
            toast.error('Fill Conversation With Fields!')
            return false
        }
        else if (!name) {
            toast.error('Fill Name fields!')
            return false
        }
        else if (!buyingDesposition) {
            toast.error('Fill the Buying Depositions fields !')
            return false
        }else if (languageIssue && (knownLanguages.length === 0 || knownLanguages === undefined)) {
            toast.error('Fill the Known Languages  fields !')
            return false
        }
        else if (!comments) {
            toast.error('Fill the Comments fields !')
            return false
        }
        else {
              return true
        }
    },
    FORM2: function(formFields){

        let { subject,conversationWith,name, buyingDesposition,followUpDateTime,comments} = formFields;

        if (!subject) {
            toast.error('Fill Subject Name Fields!')
            return false
        }
        else if (!conversationWith) {
            toast.error('Fill Conversation With Fields!')
            return false
        }
        else if (!name) {
            toast.error('Fill Name fields!')
            return false
        }
        else if (!buyingDesposition) {
            toast.error('Fill the Buying Depositions fields !')
            return false
        }
        else if (!followUpDateTime) {
            toast.error('Fill Follow Up Date Time Fields!')
            return false
        }
        else if (!comments) {
            toast.error('Fill the Comments fields !')
            return false
        }
        else {
              return true
        }
    },
    FORM3: function(formFields){

        let { conversationWith,name, buyingDesposition,languageIssue,followUpDateTime,reasonForDQ,comments,knownLanguages} = formFields;
        // console.log("comments inside validations",comments)

        if (!conversationWith) {
            toast.error('Fill Conversation With Fields!')
            return false
        }
        else if (!name) {
            toast.error('Fill Name fields!')
            return false
        }
        else if (!buyingDesposition) {
            toast.error('Fill the Buying Depositions fields !')
            return false
        }
        else if (languageIssue && (knownLanguages === "" || knownLanguages === undefined)) {
            toast.error('Fill the Known Languages  fields !')
            return false
        }
        else if (!followUpDateTime) {
            toast.error('Fill Follow Up Date Time Fields!')
            return false
        }
        else if (!reasonForDQ) {
            toast.error('Fill the Reason For DQ fields !')
            return false
        }
        else if (!comments) {
            toast.error('Fill the Comments fields updated!')
            return false
        }
        else {
              return true
        }
    },
    FORM4: function(formFields){

        let { conversationWith,name, buyingDesposition,languageIssue,reasonForDQ,comments,knownLanguages} = formFields;

        if (!conversationWith) {
            toast.error('Fill Conversation With Fields!')
            return false
        }
        else if (!name) {
            toast.error('Fill Name fields!')
            return false
        }
        else if (!buyingDesposition) {
            toast.error('Fill the Buying Depositions fields !')
            return false
        }
        else if (languageIssue && (knownLanguages === "" || knownLanguages === undefined)) {
            toast.error('Fill the Known Languages  fields !')
            return false
        }
        else if (!reasonForDQ) {
            toast.error('Fill the ReasonForDQ fields !')
            return false
        }
        else if (!comments) {
            toast.error('Fill the Comments fields !')
            return false
        }
        else {
              return true
        }
    },
    FORM5: function(formFields){
        //console.log(formFields)
        let { subject,conversationWith,name, buyingDesposition,followUpDateTime,reasonForDQ,comments} = formFields;
        //console.log(comments)
        if (!subject) {
            toast.error('Fill Subject Name Fields!')
            return false
        }
        else if (!conversationWith) {
            toast.error('Fill Conversation With Fields!')
            return false
        }
        else if (!name) {
            toast.error('Fill Name fields!')
            return false
        }
        else if (!buyingDesposition) {
            toast.error('Fill the Buying Depositions fields !')
            return false
        }
        else if (!followUpDateTime) {
            toast.error('Fill Follow Up Date Time Fields!')
            return false
        }
        else if (!comments) {
            // console.log('comments')
            toast.error('Fill the Comments fields !')
            return false
        }
        else {
              return true
        }
    },
    FORM6: function(formFields){

        let { conversationWith,name, buyingDesposition,seminar,languageIssue,followUpDateTime,comments, knownLanguages} = formFields;

        if (!conversationWith) {
            toast.error('Fill Conversation With Fields!')
            return false
        }
        else if (!name) {
            toast.error('Fill Name fields!')
            return false
        }
        else if (!buyingDesposition) {
            toast.error('Fill the Buying Depositions fields !')
            return false
        }
        else if (!seminar) {
            toast.error('Fill the Seminar fields !')
            return false
        }
        else if (languageIssue && (knownLanguages === "" || knownLanguages === undefined)) {
            toast.error('Fill the Known Languages  fields !')
            return false
        }
        if (!followUpDateTime) {
            toast.error('Fill Follow Up Date Time Fields!')
            return false
        }
        else if (!comments) {
            toast.error('Fill the Comments fields !')
            return false
        }
        else {
              return true
        }
    },
    FORM7: function(formFields){

        let { subject, conversationWith,name, buyingDesposition, followUpDateTime, comments} = formFields;
            
        if (!subject) {
            toast.error('Fill Subject Name Fields!')
            return false
        }
        else if (!conversationWith) {
            toast.error('Fill Conversation With Fields!')
            return false
        }
        else if (!name) {
            toast.error('Fill Name fields!')
            return false
        }
        else if (!buyingDesposition) {
            toast.error('Fill the Buying Depositions fields !')
            return false
        }
        if (!followUpDateTime) {
            toast.error('Fill Follow Up Date Time Fields!')
            return false
        }
        else if (!comments) {
            toast.error('Fill the Comments fields !')
            return false
        }
        else {
              return true
        }
    },
    FORM8: function(formFields){

        let { subject,conversationWith,name,appointmentStatus,followUpDateTime,comments} = formFields;

        if (!subject) {
            toast.error('Fill Subject Name Fields!')
            return false
        }
        else if (!conversationWith) {
            toast.error('Fill Conversation With Fields!')
            return false
        }
        else if (!name) {
            toast.error('Fill Name fields!')
            return false
        }
        else if (!appointmentStatus) {
            toast.error('Fill Appointment Status fields!')
            return false
        }
        if (!followUpDateTime) {
            toast.error('Fill Follow Up Date Time Fields!')
            return false
        }
        else if (!comments) {
            toast.error('Fill the Comments fields !')
            return false
        }
        else {
              return true
        }
    },
    FORM9: function(formFields){

        let { conversationWith,name, buyingDesposition,seminar,followUpDateTime,comments} = formFields;

      
        if (!conversationWith) {
            toast.error('Fill Conversation With Fields!')
            return false
        }
        else if (!name) {
            toast.error('Fill Name fields!')
            return false
        }
        else if (!buyingDesposition) {
            toast.error('Fill the Buying Depositions fields !')
            return false
        }
        else if (!seminar) {
            toast.error('Fill the Seminar fields !')
            return false
        }
        if (!followUpDateTime) {
            toast.error('Fill Follow Up Date Time Fields!')
            return false
        }
        else if (!comments) {
            toast.error('Fill the Comments fields !')
            return false
        }
        else {
              return true
        }
    },
    FORM10: function(formFields){

        let {conversationWith, name, buyingDesposition, reasonForDQ, comments} = formFields;

        if (!conversationWith) {
            toast.error('Fill Conversation With Fields!')
            return false
        }
        else if (!name) {
            toast.error('Fill Name fields!')
            return false
        }
        else if (!buyingDesposition) {
            toast.error('Fill the Buying Depositions fields !')
            return false
        }
        else if (!reasonForDQ) {
            toast.error('Fill the ReasonForDQ fields !')
            return false
        }
        else if (!comments) {
            toast.error('Fill the Comments fields !')
            return false
        }
        else {
              return true
        }
    },
    FORM11: function(formFields){

        let { subject, conversationWith, name, appointmentStatus, seminar, followUpDateTime, comments} = formFields;

        if (!subject) {
            toast.error('Fill Subject Name Fields!')
            return false
        }
        else if (!conversationWith) {
            toast.error('Fill Conversation With Fields!')
            return false
        }
        else if (!name) {
            toast.error('Fill Name fields!')
            return false
        }
        else if (!appointmentStatus) {
            toast.error('Fill Appointment Status fields!')
            return false
        }
        else if (!seminar) {
            toast.error('Fill the Seminar fields !')
            return false
        }
        if (!followUpDateTime) {
            toast.error('Fill Follow Up Date Time Fields!')
            return false
        }
        else if (!comments) {
            toast.error('Fill the Comments fields !')
            return false
        }
        else {
              return true
        }
    },
    FORM12: function(formFields){

        let { subject, conversationWith, name, appointmentStatus,  reasonForDQ, comments} = formFields;

        if (!subject) {
            toast.error('Fill Subject Name Fields!')
            return false
        }
        else if (!conversationWith) {
            toast.error('Fill Conversation With Fields!')
            return false
        }
        else if (!name) {
            toast.error('Fill Name fields!')
            return false
        }
        else if (!appointmentStatus) {
            toast.error('Fill Appointment Status fields!')
            return false
        }
        else if (!reasonForDQ) {
            toast.error('Fill the ReasonForDQ fields !')
            return false
        }
        else if (!comments) {
            toast.error('Fill the Comments fields !')
            return false
        }
        else {
              return true
        }
    },
    FORM13: function(formFields){

        let { subject, conversationWith, name, appointmentStatus, followUpDateTime, comments} = formFields;

        if (!subject) {
            toast.error('Fill Subject Name Fields!')
            return false
        }
        else if (!conversationWith) {
            toast.error('Fill Conversation With Fields!')
            return false
        }
        else if (!name) {
            toast.error('Fill Name fields!')
            return false
        }
        else if (!appointmentStatus) {
            toast.error('Fill Appointment Status fields!')
            return false
        }
        if (!followUpDateTime) {
            toast.error('Fill Follow Up Date Time Fields!')
            return false
        }
        else if (!comments) {
            toast.error('Fill the Comments fields !')
            return false
        }
        else {
              return true
        }
    },
    FORM14: function(formFields){

        let { subject, conversationWith, name, appointmentStatus, reasonForDQ, comments} = formFields;

        if (!subject) {
            toast.error('Fill Subject Name Fields!')
            return false
        }
        else if (!conversationWith) {
            toast.error('Fill Conversation With Fields!')
            return false
        }
        else if (!name) {
            toast.error('Fill Name fields!')
            return false
        }
        else if (!appointmentStatus) {
            toast.error('Fill Appointment Status fields!')
            return false
        }
        else if (!reasonForDQ) {
            toast.error('Fill the Comments fields !')
            return false
        }
        else if (!comments) {
            toast.error('Fill the Comments fields !')
            return false
        }
        else {
              return true
        }
    },
    FORM15: function(formFields){

        let { subject, conversationWith, name, appointmentStatus, followUpDateTime, comments} = formFields;

        if (!subject) {
            toast.error('Fill Subject Name Fields!')
            return false
        }
        else if (!conversationWith) {
            toast.error('Fill Conversation With Fields!')
            return false
        }
        else if (!name) {
            toast.error('Fill Name fields!')
            return false
        }
        else if (!appointmentStatus) {
            toast.error('Fill Appointment Status fields!')
            return false
        }
        if (!followUpDateTime) {
            toast.error('Fill Follow Up Date Time Fields!')
            return false
        }
        else if (!comments) {
            toast.error('Fill the Comments fields !')
            return false
        }
        else {
              return true
        }
    },
    FORM16: function(formFields){

        let { subject, conversationWith, name, appointmentStatus, buyingDesposition, seminar, languageIssue, 
            followUpDateTime, reasonForDQ, comments,knownLanguages} = formFields;

        if (!subject) {
            toast.error('Fill Subject Name Fields!')
            return false
        }
        else if (!conversationWith) {
            toast.error('Fill Conversation With Fields!')
            return false
        }
        else if (!name) {
            toast.error('Fill Name fields!')
            return false
        }
        else if (!appointmentStatus) {
            toast.error('Fill Appointment Status fields!')
            return false
        }
        else if (!buyingDesposition) {
            toast.error('Fill the Buying Depositions fields !')
            return false
        }
        else if (!seminar) {
            toast.error('Fill the Seminar fields !')
            return false
        }
        else if (languageIssue && (knownLanguages === "" || knownLanguages === undefined)) {
            toast.error('Fill the Known Languages  fields !')
            return false
        }
        if (!followUpDateTime) {
            toast.error('Fill Follow Up Date Time Fields!')
            return false
        }
        else if (!reasonForDQ) {
            toast.error('Fill the Comments fields !')
            return false
        }
        else if (!comments) {
            toast.error('Fill the Comments fields !')
            return false
        }
        else {
              return true
        }
    },
    FORM17: function(formFields){

        let { subject, conversationWith, name, appointmentStatus, reasonForDQ, comments} = formFields;

        if (!subject) {
            toast.error('Fill Subject Name Fields!')
            return false
        }
        else if (!conversationWith) {
            toast.error('Fill Conversation With Fields!')
            return false
        }
        else if (!name) {
            toast.error('Fill Name fields!')
            return false
        }
        else if (!appointmentStatus) {
            toast.error('Fill Appointment Status fields!')
            return false
        }
        else if (!reasonForDQ) {
            toast.error('Fill the ReasonForDQ fields !')
            return false
        }
        else if (!comments) {
            toast.error('Fill the Comments fields !')
            return false
        }
        else {
              return true
        }
    },
    FORM18: function(formFields){

        let { subject, conversationWith, name, appointmentStatus, seminar, followUpDateTime, comments} = formFields;

        if (!subject) {
            toast.error('Fill Subject Name Fields!')
            return false
        }
        else if (!conversationWith) {
            toast.error('Fill Conversation With Fields!')
            return false
        }
        else if (!name) {
            toast.error('Fill Name fields!')
            return false
        }
        else if (!appointmentStatus) {
            toast.error('Fill Appointment Status fields!')
            return false
        }
        else if (!seminar) {
            toast.error('Fill the Seminar fields !')
            return false
        }
        if (!followUpDateTime) {
            toast.error('Fill Follow Up Date Time Fields!')
            return false
        }
        else if (!comments) {
            toast.error('Fill the Comments fields !')
            return false
        }
        else {
              return true
        }
    },
    FORM19: function(formFields){

        let { subject, conversationWith, name, appointmentStatus, followUpDateTime, comments} = formFields;

        if (!subject) {
            toast.error('Fill Subject Name Fields!')
            return false
        }
        else if (!conversationWith) {
            toast.error('Fill Conversation With Fields!')
            return false
        }
        else if (!name) {
            toast.error('Fill Name fields!')
            return false
        }
        else if (!appointmentStatus) {
            toast.error('Fill Appointment Status fields!')
            return false
        }
        if (!followUpDateTime) {
            toast.error('Fill Follow Up Date Time Fields!')
            return false
        }
        else if (!comments) {
            toast.error('Fill the Comments fields !')
            return false
        }
        else {
              return true
        }
    },
    FORM20: function(formFields){

        let { subject, conversationWith, name, appointmentStatus, seminar, followUpDateTime, comments} = formFields;

        if (!subject) {
            toast.error('Fill Subject Name Fields!')
            return false
        }
        else if (!conversationWith) {
            toast.error('Fill Conversation With Fields!')
            return false
        }
        else if (!name) {
            toast.error('Fill Name fields!')
            return false
        }
        else if (!appointmentStatus) {
            toast.error('Fill Appointment Status fields!')
            return false
        }
        else if (!seminar) {
            toast.error('Fill the Seminar fields !')
            return false
        }
        if (!followUpDateTime) {
            toast.error('Fill Follow Up Date Time Fields!')
            return false
        }
        else if (!comments) {
            toast.error('Fill the Comments fields !')
            return false
        }
        else {
              return true
        }
    },
    FORM21: function(formFields){

        let { subject, conversationWith, name, buyingDesposition, seminar, followUpDateTime, comments} = formFields;

        if (!subject) {
            toast.error('Fill Subject Name Fields!')
            return false
        }
        else if (!conversationWith) {
            toast.error('Fill Conversation With Fields!')
            return false
        }
        else if (!name) {
            toast.error('Fill Name fields!')
            return false
        }
        else if (!buyingDesposition) {
            toast.error('Fill the Buying Depositions fields !')
            return false
        }
        else if (!seminar) {
            toast.error('Fill the Seminar fields !')
            return false
        }
        if (!followUpDateTime) {
            toast.error('Fill Follow Up Date Time Fields!')
            return false
        }
        else if (!comments) {
            toast.error('Fill the Comments fields !')
            return false
        }
        else {
              return true
        }
    },
    FORM22: function(formFields){

        let { subject, conversationWith, name, buyingDesposition, reasonForDQ, comments} = formFields;

        if (!subject) {
            toast.error('Fill Subject Name Fields!')
            return false
        }
        else if (!conversationWith) {
            toast.error('Fill Conversation With Fields!')
            return false
        }
        else if (!name) {
            toast.error('Fill Name fields!')
            return false
        }
        else if (!buyingDesposition) {
            toast.error('Fill the Buying Depositions fields !')
            return false
        }
        else if (!reasonForDQ) {
            toast.error('Fill the ReasonForDQ fields !')
            return false
        }
        else if (!comments) {
            toast.error('Fill the Comments fields !')
            return false
        }
        else {
              return true
        }
    },
    FORM23: function(formFields){

        let { subject, conversationWith, name, buyingDesposition, seminar, followUpDateTime, comments} = formFields;

        if (!subject) {
            toast.error('Fill Subject Name Fields!')
            return false
        }
        else if (!conversationWith) {
            toast.error('Fill Conversation With Fields!')
            return false
        }
        else if (!name) {
            toast.error('Fill Name fields!')
            return false
        }
        else if (!buyingDesposition) {
            toast.error('Fill the Buying Depositions fields !')
            return false
        }
        else if (!seminar) {
            toast.error('Fill the Seminar fields !')
            return false
        }
        if (!followUpDateTime) {
            toast.error('Fill Follow Up Date Time Fields!')
            return false
        }
        else if (!comments) {
            toast.error('Fill the Comments fields !')
            return false
        }
        else {
              return true
        }
    },
    FORM24: function(formFields){

        let { subject, conversationWith, name, buyingDesposition, disqualificationDate, comments} = formFields;

        if (!subject) {
            toast.error('Fill Subject Name Fields!')
            return false
        }
        else if (!conversationWith) {
            toast.error('Fill Conversation With Fields!')
            return false
        }
        else if (!name) {
            toast.error('Fill Name fields!')
            return false
        }
        else if (!buyingDesposition) {
            toast.error('Fill the Buying Depositions fields !')
            return false
        }
        else if (!disqualificationDate) {
            toast.error('Fill the disqualificationDate fields !')
            return false
        }
        else if (!comments) {
            toast.error('Fill the Comments fields !')
            return false
        }
        else {
              return true
        }
    },
    FORM25: function(formFields){

        let { subject, conversationWith, name, appointmentStatus, disqualificationDate, comments} = formFields;

        if (!subject) {
            toast.error('Fill Subject Name Fields!')
            return false
        }
        else if (!conversationWith) {
            toast.error('Fill Conversation With Fields!')
            return false
        }
        else if (!name) {
            toast.error('Fill Name fields!')
            return false
        }
        else if (!appointmentStatus) {
            toast.error('Fill the Appointment status fields !')
            return false
        }
        else if (!disqualificationDate) {
            toast.error('Fill the disqualificationDate fields !')
            return false
        }
        else if (!comments) {
            toast.error('Fill the Comments fields !')
            return false
        }
        else {
              return true
        }
    },
    FORM26: function(formFields){

        let { subject, conversationWith, name, buyingDesposition, disqualificationDate, comments} = formFields;

        if (!subject) {
            toast.error('Fill Subject Name Fields!')
            return false
        }
        else if (!conversationWith) {
            toast.error('Fill Conversation With Fields!')
            return false
        }
        else if (!name) {
            toast.error('Fill Name fields!')
            return false
        }
        else if (!buyingDesposition) {
            toast.error('Fill the Buying Depositions fields !')
            return false
        }
        else if (!disqualificationDate) {
            toast.error('Fill the disqualificationDate fields !')
            return false
        }
        else if (!comments) {
            toast.error('Fill the Comments fields !')
            return false
        }
        else {
              return true
        }
    },
    FORMC: function(formFields){

        let { subject, conversationWith, name, appointmentStatus, buyingDesposition, seminar, languageIssue, 
            followUpDateTime, reasonForDQ, comments} = formFields;

        if (!subject) {
            toast.error('Fill Subject Name Fields!')
            return false
        }
        else if (!conversationWith) {
            toast.error('Fill Conversation With Fields!')
            return false
        }
        else if (!name) {
            toast.error('Fill Name fields!')
            return false
        }
        else if (!appointmentStatus) {
            toast.error('Fill Appointment Status fields!')
            return false
        }
        else if (!buyingDesposition) {
            toast.error('Fill the Buying Depositions fields !')
            return false
        }
        else if (!seminar) {
            toast.error('Fill the Seminar fields !')
            return false
        }
        else if (!languageIssue) {
            toast.error('Fill Language Issue fields!')
            return false
        }
        if (!followUpDateTime) {
            toast.error('Fill Follow Up Date Time Fields!')
            return false
        }
        else if (!reasonForDQ) {
            toast.error('Fill the Comments fields !')
            return false
        }
        else if (!comments) {
            toast.error('Fill the Comments fields !')
            return false
        }
        else {
              return true
        }
    },
}