import React, { useEffect, useState } from "react";
import {
  getImplementationById,
  getProductField,
} from "../../config/services/implementationForm";
import Page from "../../components/Page";
import ImplementationHardwareDetails from "./ImplementationHardwareDetails";
import ServiceTable from "./ServiceTable";
import ProductDataTable from "./ProductDataTable";
import SPOCDetails from "./SPOCDetails";

const HardwareConstant = [
  {
    productKey: "",
    productName: "Hardware Details",
    productDataList: [],
    productTable: [
      {
        field: "productItemName",
        isEditable: false,
        value: "",
        label: "Product Details",
      },
      {
        field: "productType",
        isEditable: false,
        value: "",
        label: "Product Type",
      },
      {
        field: "productItemQuantity",
        isEditable: false,
        value: "",
        label: "Total Units",
      },
      {
        field: "implementedUnit",
        isEditable: false,
        type: "number",
        value: "",
        label: "Units to be Implemented",
      },
    ],
  },
  {
    productKey: "",
    productName: "Hardware Content Details",
    productDataList: [],
    productTable: [
      {
        field: "productItemName",
        isEditable: false,
        value: "",
        label: "Product Details",
      },
      {
        field: "productType",
        isEditable: false,
        value: "",
        label: "Product Type",
      },
      {
        field: "productUnit",
        isEditable: false,
        value: "",
        label: "Total Units to be Implemented",
      },
      {
        field: "class",
        isEditable: false,
        type: "dropdown",
        value: "",
        label: "Class",
      },
      {
        field: "implementedUnit",
        isEditable: false,
        type: "number",
        value: "",
        label: "Units to be Implemented",
      },
    ],
  },
];

const ImplementationDetails = ({ impFormNumber }) => {
  const [implementationData, setImplementationData] = useState(null);
  const [productSchema, setProductSchema] = useState([]);
  const [totalProductTable, setTotalProductTable] = useState([]);
  const [hardwareProductTable, setHardwareProductTable] = useState([]);
  const [serviceData, setServiceData] = useState([]);

  const getImplementationDetail = async (code) => {
    let getPro = await getProductField();
    let getProductTables = getPro?.result[0]?.productsField?.map((product) => {
      product?.productTable?.map((obj) => {
        if (obj.isEditable) {
          obj.isEditable = false;
          return obj;
        }
        return obj;
      });
      return product;
    });
    setProductSchema(getProductTables);
    await getImplementationById(code)
      .then((res) => {
        setImplementationData(res?.result[0]);
        setTotalProductTable(res?.result[0]?.productDetails);
        let newAr = HardwareConstant.map((product) => {
          if (product.productName === "Hardware Details") {
            product.productDataList = res?.result[0]?.hardwareDetails;
            return product;
          }
          if (product.productName === "Hardware Content Details") {
            product.productDataList = res?.result[0]?.hardwareContentDetails;
            return product;
          }
        });
        setHardwareProductTable(newAr);
        setServiceData(res?.result[0]?.serviceDetails);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    getImplementationDetail(impFormNumber);
  }, [impFormNumber]);

  return (
    <Page
      title="Extramarks | Quotation Table"
      className="main-container myLeadPage datasets_container"
    >
      <ProductDataTable
        productTable={totalProductTable}
        productSchema={productSchema}
      />
      <ImplementationHardwareDetails
        hardwareProductTable={hardwareProductTable}
      />
      <ServiceTable serviceData={serviceData} />
      <SPOCDetails implementationData={implementationData} />
    </Page>
  );
};

export default ImplementationDetails;
