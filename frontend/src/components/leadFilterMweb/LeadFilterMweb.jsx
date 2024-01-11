import React, { useState } from "react";
import './LeadFilterMweb.scss'
import { Tabs, Radio } from "antd";
import crossIcon from "./images/crossIcon.svg";
import filterIcon from "./images/FilterIcon.svg";

const LeadFilterMweb = () => {
    const { TabPane } = Tabs;
    const [showFilter, setShowFilter] = useState(false)

    return (
        <>
            {showFilter ? (
                <div className="leadCustomsTabs">
                    <div className="tabsHeader">
                        <div className="heading">Filter</div>
                        <img src={crossIcon} alt="" onClick={() => setShowFilter(false)} />
                    </div>
                    <Tabs
                        defaultActiveKey="1"
                        tabPosition={"left"}
                        style={{ height: "calc(100% - 130px)" }}
                    >
                        {[...Array(10).keys()].map((i) => (
                            <TabPane tab={`Tab-${i}`} key={i}>
                                <Radio.Group>
                                    <Radio value={1}>
                                        Option A
                                    </Radio>
                                    <Radio value={2}>
                                        Option B
                                    </Radio>
                                    <Radio value={3}>
                                        Option C
                                    </Radio>
                                    <Radio value={4}>
                                        More...
                                    </Radio>
                                </Radio.Group>
                            </TabPane>
                        ))}
                    </Tabs>
                    <div className="tabsFooter">
                        <div className="clearBtn">Clear All</div>
                        <div className="applyBtn">Apply</div>
                    </div>
                </div>
            ) : (
                <div className="filterIconContainer" onClick={() => setShowFilter(true)} >
                    <img src={filterIcon} alt="" srcSet="" />
                    Filter
                </div>
            )}

        </>
    )
}

export default LeadFilterMweb
