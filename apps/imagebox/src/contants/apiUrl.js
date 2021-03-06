// api的根路径.
export const API_BASE = __DEVELOPMENT__ ? 'http://www.zno.com.dd/' : '/';

// 获取todo列表的api接口
export const GET_TODO_LIST = '../../imagebox/src/sources/data.json';

export const GET_SPEC_DATA = '<%=baseUrl%>frontPages/getProductSpec/ImageBox';

// export const GET_PROJECT_DATA = '<%=baseUrl%>userid/<%=userId%>/project/<%=projectId%>';
export const GET_PROJECT_DATA = '../../imagebox/src/sources/project-has-images-iw.xml';
//export const GET_PROJECT_DATA = '../../imagebox/src/sources/project-new-iw.xml';

export const GET_FONTS = '../../imagebox/src/sources/fonts.xml';

export const NEW_PROJECT = '<%=baseUrl%>general/<%=userId%>/project/IB';

export const SAVE_PROJECT = '<%=baseUrl%>general/<%=userId%>/project/<%=projectId%>/IB';

// 登录接口
export const LOGIN = '<%=baseUrl%>phone/nativeLogin.ep?username=<%=username%>&password=<%=password%>';

// 上传前获取imageids接口
export const GET_IMAGE_IDS = '<%=uploadBaseUrl%>/upload/UploadServer/GetBatchImageIds';

// 图片上传接口
export const UPLOAD_IMAGES = '<%=uploadBaseUrl%>/upload/UploadServer/uploadImg';

// 图片裁剪接口
export const IMAGES_CROPPER = '<%=baseUrl%>imageBox/liveUpdateCropImage.ep';
export const IMAGES_CROPPER_PARAMS = '?imageId=<%=imageId%>&encImgId=<%=encImgId%>&px=<%=px%>&py=<%=py%>&pw=<%=pw%>&ph=<%=ph%>&width=<%=width%>&height=<%=height%>&rotation=<%=rotation%>';

// 获取接口的base url.
export const GET_ENV = '<%=baseUrl%>userid/getEnv';

// 获取用户的会话信息.
export const GET_SESSION_USER_INFO = '<%=baseUrl%>BigPhotoBookServlet/getSessionUserInfo';

// 获取用户的album id.
export const GET_USER_ALBUM_ID = '<%=baseUrl%>userid/<%= userId %>/getAlbumId';

// 获取产品的price
export const GET_PRODUCT_PRICE = '<%=baseUrl%>/clientH5/product/price?product=<%=product%>&options=<%=options%>';

//获取图片地址
export const IMAGE_SRC = 'upload/UploadServer/PicRender';

//获取文字图片地址
export const TEXT_SRC = '<%=fontBaseUrl%>product/text/textImage?text=<%=text%>&font=<%=fontFamily%>&fontSize=<%=fontSize%>&color=<%=fontColor%>&align=<%=textAlign%>';
