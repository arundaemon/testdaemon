import { useEffect, useState } from "react";
import { fieldTab } from "../../constants/general";
import { Tabs } from "./Tabs";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";

export const NavigateTab = ({
  data,
  pageCode,
  NaviagteLink,
  isShowSSRForm,
  isShowQCForm,
  isCreateActivity,
  route
}) => {
  let TAB_1, TAB_2, TAB_3, TAB_4, TAB_5;

  var isTabArray = [TAB_1, TAB_2, TAB_3, TAB_4, TAB_5];

  isTabArray = [
    {
      label: fieldTab?.Quotation,
    },
    {
      label: fieldTab?.PO,
    },
    {
      label: fieldTab?.Implementation,
    },
    {
      label: fieldTab?.SSR,
    },
    {
      label: fieldTab?.isQC,
    },
  ];

  const navigate = useNavigate();

  // if (NaviagteLink) {
  //   isTabArray = NaviagteLink;
  // }

  const [activeTab, setActiveTab] = useState("");
  const [isRedirect, setRedirect] = useState(false)

  useEffect(() => {
    const isMatchType = isTabArray?.find((obj) => obj?.label === data);
    if (data) {
      setActiveTab(isMatchType);
    }
  }, [data]);

  const navigateTo = (row, page) => {
    if (activeTab?.label === fieldTab?.Quotation) {
      let _url = `/authorised/quotation`;
      navigate(_url, {
        state: {
          linkType: activeTab?.label,
          impFormNumber: pageCode,
        },
      });
    } else if (activeTab?.label === fieldTab?.Implementation) {
      if (isCreateActivity) {
        let _url = `/authorised/site-survey-activity/${pageCode}`;
        navigate(_url, {
          state: {
            linkType: activeTab?.label,
            impFormNumber: pageCode,
          },
        });
      }else {
        let _url = `/authorised/site-survey/${pageCode}`;
        navigate(_url, {
          state: {
            linkType: activeTab?.label,
            impFormNumber: pageCode,
          },
        });
      }
    } else if (activeTab?.label === fieldTab?.PO) {
      let _url = `/authorised/purchase-order`;
      navigate(_url, {
        state: {
          linkType: activeTab?.label,
          impFormNumber: pageCode,
        },
      });
    } else if (activeTab?.label === fieldTab?.SSR) {
      if (!isShowSSRForm) {
        let _url = `/authorised/site-survey-detail/${pageCode}`;
        navigate(_url, {
          state: {
            linkType: fieldTab?.SSR,
          },
        });
      } else {
        let _url = `/authorised/site-survey-dash/${pageCode}`;
        navigate(_url, {
          state: {
            linkType: fieldTab?.SSR,
          },
        });
      }
    }
    else if (activeTab?.label === fieldTab?.isQC) {
      if (!isShowQCForm) {
        let _url = `/authorised/QC-detail/${pageCode}`;
        navigate(_url, {
          state: {
            linkType: fieldTab?.isQC,
          },
        });
      } else {
        let _url = `/authorised/add-QC/${pageCode}`;
        navigate(_url, {
          state: {
            linkType: fieldTab?.isQC,
          },
        });
      }
    }
  };

  useEffect(() => {
    if (activeTab && isRedirect) {
      navigateTo();
    }
  }, [activeTab, isRedirect]);

  return (
    <Box className={`crm-quotation-tabs`}>
      <Tabs >
        {isTabArray?.map((item, index) => {
          return (
            <Tabs.Item
              key={index}
              active={item.label === activeTab.label}
              onClick={() => {
                setActiveTab(item);
                setRedirect(true)
              }}
            >
              {item.label}
              {item.color}
            </Tabs.Item>
          );
        })}
      </Tabs>
    </Box>
  );
};
