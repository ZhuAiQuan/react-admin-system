import axios from 'utils/index';

export const getImgUrl = (fileName: string) => {
  return axios.request({
    url: '/api/admin/file/downloadBase64',
    method: 'get',
    params: {
      fileName
    }
  })
}
export const uploadFile = (file: FormData) => {
  return axios.request({
    url: '/api/admin/file/fileUpload',
    method: 'post',
    data: file
  })
}
// 上传文件返回全路径
export const uploadFileReturnUrl = (file: FormData) => {
  return axios.request({
    url: '/api/admin/file/fileUploadReturnAbsolutePath',
    method: 'post',
    data: file
  })
}