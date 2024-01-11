export const accordionFields = [
  {
    title: 'Primary Details of School',
    fields: [
      {
        name: 'schoolName',
        label: 'School Name *',
        type: 'text',
        placeholder: 'Enter School Name',
        renderType: 'textField',
      },
      {
        name: 'board',
        label: 'Board *',
        type: 'Select',
        renderType: 'reactSelect',
      },
      {
        name: 'boardClass',
        label: 'Class *',
        type: 'Select',
        renderType: 'reactSelect',
      },
      {
        name: 'schEmailId',
        label: 'School Email Id *',
        type: 'text',
        placeholder: 'Enter School Email ID',
        renderType: 'textField',
      },
      {
        name: 'institueType',
        label: 'Type of Institute *',
        type: 'Select',
        renderType: 'reactSelect',
      },
      {
        name: 'competitorName',
        label: 'Competitor Name *',
        placeholder: 'Enter Competitor Name',
        type: 'text',
        renderType: 'textField',
      },
      {
        name: 'totalStudent',
        label: 'Total Student *',
        type: 'text',
        placeholder: 'Enter Total Student',
        renderType: 'textField',
      },
      {
        name: 'totalTeacher',
        label: 'Total Teacher *',
        placeholder: 'Enter Total Teacher',
        type: 'text',
        renderType: 'textField',
      },
      {
        name: 'associateInstitute',
        label: 'Associate Institute',
        placeholder: 'Enter Associate Institute / Organization Name',
        type: 'text',
        renderType: 'textField',
      },
    ],
  },

  {
    title: 'Demographic Details',
    fields: [
      {
        name: 'schWebsite',
        label: 'School WebSite *',
        placeholder: 'Enter School Website',
        type: 'text',
        renderType: 'textField',
      },
      {
        name: 'offeredSubject',
        label: 'Subject Offered 10th & 12th *',
        type: 'Select',
        renderType: 'reactSelect',
      },
      {
        name: 'addMissionfee',
        label: 'Addmission Fee',
        placeholder: 'INR',
        type: 'text',
        renderType: 'textField',
      },
      {
        name: 'tutionFee',
        label: 'Tution Fee',
        placeholder: 'INR',
        type: 'text',
        renderType: 'textField'
      },
    ],
  },

  {
    title: 'School Address',
    islocaion: true,
    fields: []
  },

  {
    title: 'Contact',
    isNested: true,
    fields: [
      {
        name: 'userName',
        label: 'Name',
        type: 'text',
        placeholder: 'Enter Name',
        renderType: 'textField',
      },
      {
        name: 'designation',
        label: 'Designation',
        type: 'Select',
        renderType: 'reactSelect',
      },
      {
        name: 'mobileNumber',
        label: 'Mobile Number',
        placeholder: 'Enter Mobile Number',
        type: 'text',
        renderType: 'textField',
      },
      {
        name: 'emailId',
        label: 'Email ID',
        placeholder: 'Enter Email ID',
        type: 'text',
        renderType: 'textField'
      },
    ],
  },
  {
    title: 'Interests Shown',
    fields: [
      {
        name: 'interestedItem',
        label: 'Product *',
        type: 'Select',
        isMulti: true,
        renderType: 'reactSelect',
      },
    ]
  }
];