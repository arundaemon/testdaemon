import { Button, Checkbox, CircularProgress, FormControl, Grid, ListItemText, MenuItem, Radio, Select, Typography } from "@mui/material";
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import DatePicker from "react-datepicker";
import toast from "react-hot-toast";
import { masterDataList, uploadFileData } from '../../config/services/packageBundle';
import { useStyles } from "../../css/SchoolDetail-css";
import { handleHsnCodeValidation, handleKeyDown, handleKeyTextDown, handleKeyTextDownWithSpecialCharacters, handleNumberKeyDown, handlePaste, handleTextPaste } from '../../helper/randomFunction';
import { getUserData } from "../../helper/randomFunction/localStorage";

const MenuProps = {
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'left',
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'left',
  },
  getContentAnchorEl: null,
  style: { position: 'absolute', zIndex: 1000 },
}



const PackageInformation = (props) => {
  let { durationTypeData, packageData, updatePackageInformationData } = props
  const classes = useStyles();
  const [productList, setProductList] = useState([])
  const [durationTypeList, setDurationTypeList] = useState([])
  const [channelList, setChannelList] = useState([])
  const [productName, setProductName] = useState({})
  const [channel, setChannel] = useState([])
  const [duration, setDuration] = useState({})
  const [packageName, setPackageName] = useState("")
  const [hsnCode, setHsnCode] = useState(null)
  const [values, setValues] = useState({})
  const [mrp, setMrp] = useState()
  const [mop, setMop] = useState()
  const [description, setDescription] = useState(["• "])
  const [upload, setUpload] = useState('')
  const [fileName, setFileName] = useState('Select attach file')
  const [pdfFile, setPdfFile] = useState('')
  const [loader1, setLoader1] = useState(false)
  const loginData = getUserData('loginData')
  const uuid = loginData?.uuid



  const handleProductNameChange = (event) => {
    let data = event?.target?.value
    setProductName(data)
  }

  // const handleChannelChange = (event) => {
  //   let data = event?.target?.value
  //   setChannel(data)
  // }

  const handleChannelChange = (item) => {
    const itemIndex = channel.findIndex(obj => obj.id === item.id);
    if (itemIndex !== -1) {
      const updatedChannel = [...channel];
      updatedChannel.splice(itemIndex, 1);
      setChannel(updatedChannel);
    } else {
      setChannel([...channel, item]);
    }
  };


  const handleDurationChange = (event) => {
    let data = event?.target?.value
    setDuration(data)
    setValues({})
  }

  const getProductList = () => {
    let params = {
      status: [1, 2, 3],
      master_data_type: "package_products",
      uuid: uuid
    }
    masterDataList(params)
      .then((res) => {
        let list = res?.data?.master_data_list
        setProductList(list)

      }).catch(err => console.error(err))
  }

  const getChannelList = () => {
    let params = {
      status: [1, 2, 3],
      master_data_type: "package_channels",
      uuid: uuid
    }
    masterDataList(params)
      .then((res) => {
        let list = res?.data?.master_data_list
        setChannelList(list)

      }).catch(err => console.error(err))

  }

  const getDurationTypeList = () => {
    let params = {
      status: [1, 2, 3],
      master_data_type: "package_duration_types",
      uuid: uuid
    }
    masterDataList(params)
      .then((res) => {
        let list = res?.data?.master_data_list
        setDurationTypeList(list)
        durationTypeData(list)

      }).catch(err => console.error(err))

  }

  useEffect(() => {
    getProductList()
    getChannelList()
    getDurationTypeList()

  }, []);


  useEffect(() => {

    let paramsObj = {
      product_id: productName?.id?.toString(),
      package_name: packageName,
      package_hsn_code: hsnCode,
      package_mrp: mrp,
      package_mop: mop,
      package_image_path: upload ? upload : "valid image upload path here",
      package_channels: channel?.map(item => ({ channel_id: item?.id?.toString() })),
      package_duration_type_id: duration?.id?.toString(),
      package_value: values?.values,
      package_description: description ? description : []
    }
    packageData(paramsObj)

  }, [productName, packageName, hsnCode, mrp, mop, channel, description, duration, values, description, upload])


  useEffect(() => {
    if (updatePackageInformationData) {
      let data = updatePackageInformationData
      const productObj = {
        id: data?.product_id,
        name: data?.product_name
      };
      const url = data?.package_image_path;
      const filename = url?.substring(url?.lastIndexOf('/') + 1);

      setProductName(productObj)
      setPackageName(data?.package_name)
      setHsnCode(data?.package_hsn_code)
      setMop(data?.package_mop)
      setMrp(data?.package_mrp)
      setFileName(filename)
      setUpload(data?.package_image_path)
      setDescription(data?.package_description)
      const durationObj = {
        id: data?.package_duration_type_id,
        name: data?.package_duration_type
      }
      const valueObj = {
        id: data?.package_duration_type_id,
        values: data?.package_value
      }
      setDuration(durationObj)
      setValues(valueObj)
      if (data?.package_channels) {
        const channelsarray = data?.package_channels?.map((item) => ({
          id: item.channel_id,
          name: item.channel_name,
          status: 1
        }));
        setChannel(channelsarray)
      }
    }
  }, [updatePackageInformationData]);




  const handleCombinedChange = (id, value, event) => {
    if (id === 1) {
      setValues({ id: 1, values: moment(value).format('YYYY-MM-DD') });
    } else if (id === 2) {
      setValues({ id: 2, values: event?.target?.value });
    }
  };


  const uploadPdf = async (e) => {
    const fileName = e.target.files[0].name
    const fileExtension = fileName.replace(/^.*\./, "")
    let file = e.target.files[0];
    if (fileExtension === 'pdf' || fileExtension === 'jpg' || fileExtension === 'png') {
      setPdfFile(file);
      setFileName(fileName)
      const formData = new FormData();
      formData.append("image", file);
      try {
        let res = await uploadFileData(formData);
        if (res?.result) {
          let uploadUrl = res?.result
          setUpload(uploadUrl);
          toast.success('File Added successfully')
        }
      } catch (err) {
        console.error(err);
      }

    }
    else {
      toast.error('File format not supported')
      setFileName('')
      return false
    }

  };

  const emptyPdfFile = () => {
    setPdfFile();
    setFileName('Select attach file')
    setUpload('')
  }



  return (
    <>
      <Grid className={classes.cusCard}>
        <Grid container spacing={3} sx={{ py: "8px" }}>
          <Grid item md={4} xs={12}>
            <Grid>
              <Typography className={classes.label}>Product Name</Typography>
              <FormControl sx={{ m: 0.1, width: 250, position: 'relative' }}>
                <Select
                  className={classes.selectNew}
                  classNamePrefix="select"
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  value={productName}
                  onChange={handleProductNameChange}
                  renderValue={(selected) => selected?.name}
                  MenuProps={MenuProps}

                >
                  {productList?.map((product) => (
                    <MenuItem key={product?.id} value={product}>
                      <Radio checked={productName?.id === product?.id} />
                      <ListItemText primary={product?.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid item md={4} xs={12}>
            <Grid>
              <Typography className={classes.label}>Package Name<span style={{ color: 'red' }}>*</span></Typography>
              <input
                className={classes.inputStyleNew}
                type="text"
                placeholder="Enter Package Name"
                maxLength={100}
                value={packageName}
                onChange={(e) => setPackageName(e?.target?.value)}
                onKeyDown={handleKeyTextDownWithSpecialCharacters}
                onPaste={handleTextPaste}

              />
            </Grid>
          </Grid>
          <Grid item md={4} xs={12}>
            <Grid>
              <Typography className={classes.label}>HSN Code<span style={{ color: 'red' }}>*</span></Typography>
              <input
                className={classes.inputStyleNew}
                name="HSN Code"
                type="number"
                placeholder="Enter HSN Code"
                maxLength="100"
                value={hsnCode}
                onChange={(e) => setHsnCode(e?.target?.value)}
                onKeyDown={handleHsnCodeValidation}
                onPaste={handlePaste}

              />
            </Grid>
          </Grid>

          <Grid item md={4} xs={12}>
            <Grid>
              <Typography className={classes.label}>
                Channel
                <span style={{ color: 'red' }}>*</span>
              </Typography>
              <FormControl sx={{ m: 0.5, width: 250 }}>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  className={classes.selectNew}
                  multiple
                  value={channel}
                  // onChange={handleChannelChange}
                  renderValue={(selected) => selected?.map((x) => x?.name).join(', ')}
                  MenuProps={MenuProps}

                >
                  {channelList?.map((item) => (
                    <MenuItem key={item?.id} value={item}>
                      <Checkbox checked={channel.findIndex(obj => obj.id === item.id) !== -1}
                        onChange={() => handleChannelChange(item)}
                      />
                      {/* <Checkbox checked={channel.some((obj) => obj.id == item.id)} /> */}
                      <ListItemText primary={item?.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid item md={4} xs={12}>
            <Grid>
              <Typography className={classes.label}>
                Duration Type
                <span style={{ color: 'red' }}>*</span>
              </Typography>
              <FormControl sx={{ m: 0.5, width: 250 }}>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  className={classes.selectNew}
                  value={duration}
                  onChange={handleDurationChange}
                  renderValue={(selected) => selected?.name}
                  MenuProps={MenuProps}

                >
                  {durationTypeList?.map((item) => (
                    <MenuItem key={item?.id} value={item}>
                      <Radio checked={duration?.id === item?.id} />
                      <ListItemText primary={item?.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>



          <Grid item md={4} xs={12}>
            <Grid>
              <Typography className={classes.label}>
                Values
                <span style={{ color: 'red' }}>*</span>
              </Typography>
              {duration?.id === 1 ?
                <div className="boxLabel">
                  <DatePicker
                    className="dateInput-custom"
                    selected={values.values ? new Date(values.values) : null}
                    onChange={(date) => handleCombinedChange(duration?.id, date)}
                    minDate={new Date()}
                    onKeyDown={(e) => {
                      e.preventDefault();
                    }}
                    onChangeRaw={(e) => e.preventDefault()}
                  />
                </div>
                :
                <input
                  className={classes.inputStyleNew}
                  type="number"
                  placeholder="Enter Number of Days"
                  maxLength={100}
                  value={values.values}
                  onChange={(e) => handleCombinedChange(duration?.id, values.values, e)}
                  onKeyDown={handleKeyDown}
                  onPaste={handlePaste}
                />

              }

            </Grid>
          </Grid>


          <Grid item md={4} xs={12}>
            <Grid>
              <Typography className={classes.label}>
                MRP
                <span style={{ color: 'red' }}>*</span>
              </Typography>
              <input
                className={classes.inputStyleNew}
                type="number"
                placeholder="Enter MRP"
                maxLength={100}
                value={mrp}
                onChange={(e) => setMrp(e?.target?.value)}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}

              />
            </Grid>
          </Grid>


          <Grid item md={4} xs={12}>
            <Grid>
              <Typography className={classes.label}>
                MOP
                <span style={{ color: 'red' }}>*</span>
              </Typography>
              <input
                className={classes.inputStyleNew}
                type="number"
                placeholder="Enter MOP"
                maxLength={100}
                value={mop}
                onChange={(e) => setMop(e?.target?.value)}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
              />
            </Grid>
          </Grid>

          <div>
            <div style={{ marginTop: '20px', }}>
              <label className={classes.subheading} style={{
                marginTop: '10px', marginLeft: '29px', fontSize: "14px", fontWeight: "600",
                color: "#000000",
              }}>Upload Picture : </label>
              <div className={classes.uploaderFile} style={{ width: '446px', height: '40px', marginLeft: '25px' }}>
                <label className={fileName?.length <= 26 ? classes.placeholder : classes.bigFileName}>{fileName}</label>
                {!pdfFile ?
                  <div className={classes.uploaderFileBtn} id="outlined-basic">
                    <input
                      style={{ display: 'none' }}
                      id="lecture_note"
                      type="file"
                      accept=".png,.jpg"
                      onChange={(e) => uploadPdf(e)}
                    />
                    <label className={classes.browse} htmlFor="lecture_note">Browse</label>
                  </div>
                  :
                  <Button className={classes.emptyPdf} style={{ color: 'black' }} onClick={emptyPdfFile}>
                    {loader1 ?
                      <CircularProgress style={{ width: '23px', height: '23px' }} /> :
                      "X"
                    }
                  </Button>
                }
              </div>
            </div>
          </div>


          <Grid item md={10} xs={12}>
            <Grid>
              <Typography className={classes.label}>
                Description
              </Typography>
              <textarea
                className={classes.inputStyleNew}
                style={{ height: "fit-content" }}
                name="Description"
                type="text"
                placeholder="Description"
                maxLength="500"
                rows={5}
                value={description?.join("\n")}
                onChange={(e) => setDescription(e?.target?.value?.split("\n"))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const updatedDescription = [...description, "• "];
                    setDescription(updatedDescription);
                  }
                }}

              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default PackageInformation
