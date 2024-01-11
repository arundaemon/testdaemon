import { useEffect, useState } from "react";
import { voucherTab } from "../../constants/general";
import { Tabs } from "../Calendar/Tabs";
import { useNavigate } from "react-router-dom";

export const NavigationVouchertab = ({
  data,
  NaviagteLink,
}) => {

  var [TAB_1, TAB_2] = [
    {
      label: voucherTab?.ActiveVoucher,
    },
    {
      label: voucherTab?.CancelledVocuher,
    },
   
  ];

  const navigate = useNavigate();
  if (NaviagteLink) {
    var [TAB_1, TAB_2] = NaviagteLink;
  }

  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    const isMatchType = [TAB_1, TAB_2]?.find(
      (obj) => obj?.label === data
    );
    if (data) {
      setActiveTab(isMatchType);
    }
  }, [data]);

  const navigateTo = (row, page) => {
    if (activeTab?.label === voucherTab?.ActiveVoucher) {
      let _url = `/authorised/hardware-voucher-list`;
      navigate(_url, {
        state: {
          linkType: activeTab?.label,
        },
      });
    } else if (activeTab?.label === voucherTab?.CancelledVocuher) {
      let _url = `/authorised/hardware-voucher-list`;
      navigate(_url, {
        state: {
          linkType: activeTab?.label,
        },
      });
    }  
    
  };

  useEffect(() => {
    if (activeTab) {
      navigateTo();
    }
  }, [activeTab]);

  return (
    <>
      <Tabs>
        {[TAB_1, TAB_2].map((item, index) => {
          return (
            <>
              <Tabs.Item
                key={index}
                active={item.label === activeTab.label}
                onClick={() => {
                  if (!item?.isDisabled) {
                    setActiveTab(item);
                  }
                }}
              >
                {item.label}
                {item.color}
              </Tabs.Item>
            </>
          );
        })}
      </Tabs>
    </>
  );
};
