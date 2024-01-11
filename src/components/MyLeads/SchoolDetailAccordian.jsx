import "../../Crm.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SchoolInterestShown from "./Accordion/AddSchoolForm/SchoolLeadAccordian/SchoolInterest";
import ContactLeadInfo from "./Accordion/AddSchoolForm/SchoolLeadAccordian/ContactLeadInfo";
import IconFire from "../../assets/icons/Icon-fire.svg";
import TeacherInfo from "./Accordion/AddSchoolForm/SchoolLeadAccordian/TeacherInfo";
import StudentIInfo from "./Accordion/AddSchoolForm/SchoolLeadAccordian/StudentInfo";
import ProductDetailInfo from "./Accordion/AddSchoolForm/SchoolLeadAccordian/ProductInfo";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  Modal,
} from "@mui/material";
import ReactSelect from "react-select";
import { useNavigate, useParams } from "react-router-dom";
import { changeleadInterestowner } from "../../config/services/leadassign";
import { toast } from "react-hot-toast";
import { getUserData } from "../../helper/randomFunction/localStorage";
import SchoolInterestDetail from "./SchoolInterestDetail";
import Pipeline from "../../assets/icons/Pipeline-icon.svg";
// import { ReactComponent as IconDropdown } from "./../../assets/icons/icon-dashboard-mobile-performance-dropdown.svg";
import { ReactComponent as IconDropdown } from "./../../assets/icons/icon-dropdown-2.svg";
import useMediaQuery from "@mui/material/useMediaQuery";
//pages

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "1px solid #fff",
  boxShadow: "0px 0px 4px #0000001A",
  p: 4,
  borderRadius: "4px",
};

export default function SchoolDetailAccordian(props) {
  let { data, roleNameList, getBdActivityInterest } = props;
  const { school_id, interest_id } = useParams();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  let createRole = [
    {
      roleName: getUserData("userData")?.crm_role,
      userName: getUserData("userData")?.username,
      displayName: getUserData("userData")?.name,
      profileName: getUserData("userData")?.crm_profile,
    },
  ];

  let removeLstIndex = roleNameList?.pop()

  if (roleNameList?.length > 0) {
    roleNameList = [...roleNameList, ...createRole];
  }else {
    roleNameList = [...createRole]
  }




  const [interestCount, setCount] = useState(null);

  const getInteestCount = (data) => {
    setCount(data);
  };


  let accordionsList = [
    {
      id: 1,
      title: `Interest shown ${interestCount ? `(${interestCount})` : ""}`,
      content: (
        <SchoolInterestShown
          data={data}
          roleNameList={roleNameList}
          getInteestCount={getInteestCount}
        />
      ),
    },
    {
      id: 2,
      title: `Contact ${
        data?.contactDetails?.length > 0
          ? `(${data?.contactDetails?.filter(obj => obj?.name)?.length})`
          : ""
      }`,
      content: <ContactLeadInfo data={data} />,
    },
    { id: 3, title: "Associated Teacher", content: <TeacherInfo /> },
    { id: 4, title: "Associated Student", content: <StudentIInfo /> },
    { id: 5, title: "Product Purchased", content: <ProductDetailInfo /> },
  ];

  const [selectUserModal, setSelectUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState([]);
  const [changeOwner, setChangeOwner] = useState(false);
  const [interestDetail, setInterestDetail] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [ownerChanged, setOwnerChanged] = useState(false);
  const navigate = useNavigate();

  const toggleChangeOwnerModal = () => {
    setInterestDetail(data);
    setSelectUserModal(!selectUserModal);
  };

  const toggleSelectUserModal = () => {
    setSelectUserModal(!selectUserModal);
  };

  const addList = async () => {
    let sampleData = selectedValues?.map((obj) => {
      if (obj?.value) {
        return {
          leadId: obj?.leadId,
          role_id: obj?.value?.roleID,
          role_code: obj?.value?.roleCode,
          role_name: obj?.value?.roleName,
          userID: obj?.value?.userID,
          userName: obj?.value?.userName,
          displayName: obj?.value?.displayName,
          profile_id: obj?.value?.profileID,
          profile_code: obj?.value?.profileCode,
          profile_name: obj?.value?.profileName,
          schoolId: obj?.schoolId,
        };
      }
    });

    sampleData = sampleData?.filter((obj) => obj != null);

    setSelectedValues([]);
    setOwnerChanged(false);
    changeleadInterestowner(sampleData)
      .then((res) => {
        if (res?.statusCode === 1) {
          toast.success("Interest Transfer Successfully");
          setOwnerChanged(true);
        } else if (res?.data?.statusCode === 0) {
          let { errorMessage } = res?.data?.error;
          toast.error(errorMessage);
        } else {
          console.error(res);
        }
      })
      .catch((error) => console.log(error, "...errror"));
  };

  const handleTransfer = () => {
    addList();
    toggleSelectUserModal();
    window.location.reload(false);
    setSelectedUser("");
  };

  const items = data?.interest ? data?.interest : [];

  const handleFilterByRole = (selectedOption, id, updateFunction) => {
    updateFunction(selectedOption); // update the specified piece of state with the new selected option
    setSelectedUser(selectedOption);
  };

  let Data = data?.interest ? data?.interest : [];

  const selectData = Data?.map((obj, index) => {
    return {
      id: index + 1,
      options: roleNameList,
      value: null,
      interestType: obj?.learningProfile,
      leadId: obj?.leadId,
      schoolId: obj?.schoolId,
    };
  });

  const renderPriorityView = (priority) => {
    if (priority === "HOTS") {
      return (
        <>
          <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
            <img src={IconFire} style={{ width: "15px" }} />
            <p
              style={{
                fontSize: "12px",
                color: "#F44040",
                fontWeight: "normal",
                marginTop: "2px",
              }}
            >
              Hot Lead
            </p>
          </div>
        </>
      );
    }
    if (priority === "Pipeline") {
      return (
        <>
          <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
            <img src={Pipeline} style={{ width: "15px" }} />
            <p
              style={{
                fontSize: "12px",
                color: "#4482FF",
                fontWeight: "normal",
                marginTop: "2px",
              }}
            >
              Pipeline Lead
            </p>
          </div>
        </>
      );
    }
  };

  let selectedInterest = data?.interest?.filter(
    (item) => item?.leadId == interest_id
  );
  let priority = selectedInterest?.[0]?.priority;
  let name = selectedInterest?.[0]?.learningProfile;
  let stageName = selectedInterest?.[0]?.stageName;
  let statusName = selectedInterest?.[0]?.statusName;

  if (!isMobile && interest_id) {
    // let selectedInterest = data?.interest?.filter(item => item?.leadId == interest_id)

    accordionsList = [
      {
        id: 1,
        title: `Interest : ${name}`,
        content: (
          <SchoolInterestDetail
            interestName={name}
            priority={priority}
            stageName={stageName}
            statusName={statusName}
            getBdActivityInterest={getBdActivityInterest}
          />
        ),
      },
    ];
  }

  useEffect(() => {
    setSelectedValues(selectData);
  }, [data]);

  const handleSelectChange = (value, id) => {
    const updatedSelectedValues = selectedValues.map((select) =>
      select.id === id ? { ...select, value } : select
    );
    setSelectedValues(updatedSelectedValues);
  };

  return (
    <div>
      {
        interest_id && isMobile
          ? <SchoolInterestDetail
              interestName={name}
              priority={priority}
              stageName={stageName}
              statusName={statusName}
              getBdActivityInterest={getBdActivityInterest}
            />

          : <>
              {/* {
                isMobile  && !interest_id
                  ? <Grid item xs={12} className="pt-0">

                      <Box className="crm-sd-steps-container crm-sd-lead-steps">
                        <Box className="crm-sd-steps-list">
                          <Box className="crm-sd-step">
                            <Box className="crm-sd-step-item">
                              <Box className="crm-sd-step-icon" ></Box>
                              <Typography component={'h5'}>Fresh</Typography>
                            </Box>
                            <Box className="crm-sd-step-item"><Box className="crm-sd-step-seperator" ></Box></Box>
                          </Box>
                          <Box className="crm-sd-step">
                            <Box className="crm-sd-step-item">
                              <Box className="crm-sd-step-icon" />
                              <Typography component={'h5'}>Qualified</Typography>
                            </Box>
                            <Box className="crm-sd-step-item"><Box className="crm-sd-step-seperator" ></Box></Box>
                          </Box>
                          <Box className="crm-sd-step">
                            <Box className="crm-sd-step-item">
                              <Box className="crm-sd-step-icon" />
                              <Typography component={'h5'}>Demo</Typography>
                            </Box>
                            
                            <Box className="crm-sd-step-item"><Box className="crm-sd-step-seperator" ></Box></Box>
                          </Box>
                          <Box className="crm-sd-step">
                            <Box className="crm-sd-step-icon" />
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  : null
              } */}
              {accordionsList?.map((obj, index) => (
                <Accordion key={index} className="cm_collapsable crm-school-details-accordion-container">
                  <AccordionSummary
                    expandIcon={<IconDropdown />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    className="table-header"
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <Typography
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          display: "flex",
                          gap: "15px",
                        }}
                      >
                        {obj?.title}
                        {interest_id ? renderPriorityView(priority, name) : ""}
                      </Typography>
                      {obj?.title ===
                        `Interest shown ${
                          data?.interest?.length > 0
                            ? `(${data?.interest?.length})`
                            : ""
                        }` &&
                      data?.interest?.length > 0 &&
                      !(getUserData("userData")?.crm_profile === "BDE") ? (
                        <Typography
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#4482FF",
                            textDecoration: "underline",
                            marginRight: "20px"
                          }}
                          onClick={() => {
                            toggleChangeOwnerModal();
                          }}
                        >
                          Change Owner
                        </Typography>
                      ) : (
                        ""
                      )}
                    </div>
                  </AccordionSummary>
                  <AccordionDetails className="listing-accordion-details">
                    {obj?.content}
                  </AccordionDetails>
                </Accordion>
              ))}
            </>
      }
      
      <div>
        {selectUserModal && (
          <Modal
            open={true}
            aria-labelledby="modal-modal-title"
            sx={{ mt: 10 }}
          >
            <Box sx={style}>
              <Typography align="center" id="modal-modal-title">
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 18,
                    marginBottom: "30px",
                  }}
                >
                  {" "}
                  Interest Transfer{" "}
                </div>
              </Typography>
              <Typography
                id="modal-modal-description"
                align="center"
                sx={{ mt: 2 }}
              >
                <List>
                  {selectData?.map(({ id, interestType }) => {
                    return (
                      <div
                        style={{
                          display: "flex",
                          gap: "30px",
                          marginBottom: "30px",
                        }}
                      >
                        <div style={{ width: "30%" }}>
                          <Typography
                            sx={{ fontSize: "14px", fontWeight: "600" }}
                          >
                            {interestType}
                          </Typography>
                        </div>
                        <ReactSelect
                          sx={{ fontSize: "20px" }}
                          classNamePrefix="select"
                          options={roleNameList}
                          getOptionLabel={(option) =>
                            option.displayName + " (" + option.roleName + ")"
                          }
                          getOptionValue={(option) => option}
                          onChange={(selectedOption) =>
                            handleSelectChange(selectedOption, id)
                          }
                          placeholder="Filter By Role"
                          className="width-100 font-14"
                          value={selectData.value}
                        />
                      </div>
                    );
                  })}
                </List>
              </Typography>
              <Typography>
                <Divider />
              </Typography>
              <Typography
                id="modal-modal-description"
                align="center"
                sx={{ mt: 2 }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: 25,
                  }}
                >
                  <Button
                    style={{ marginRight: "20px", borderRadius: 4 }}
                    onClick={() => {
                      setChangeOwner(false);
                      setSelectedUser("");
                      toggleSelectUserModal();
                    }}
                    variant="outlined"
                  >
                    Cancel
                  </Button>
                  <Button
                    style={{ borderRadius: 4 }}
                    onClick={handleTransfer}
                    variant="contained"
                  >
                    Transfer
                  </Button>
                </div>
              </Typography>
            </Box>
          </Modal>
        )}
      </div>
    </div>
  );
}
