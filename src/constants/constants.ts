export const PAGE_SIZE = 8;

export const LIGHT_MODE = "light",
	DARK_MODE = "dark",
	AUTO_MODE = "auto";
export const DEFAULT_THEME = AUTO_MODE;

// Banner height unit: vh
export const BANNER_HEIGHT = 28;		//非首页的 banner 高度
export const BANNER_HEIGHT_EXTEND = 17;		//向上延伸的banner高度
export const BANNER_HEIGHT_HOME = BANNER_HEIGHT + BANNER_HEIGHT_EXTEND;		//首页的 banner 高度
	// 首页的banner高度是二者之和，所以调大任意一个都会让首页变大，但是非首页的banner高度由banner_height决定
export const MAIN_PANEL_OVERLAPS_BANNER_HEIGHT = 3.5;		//主内容区域与banner重叠的高度(单位：rem)
export const BANNER_BLUR_HEIGHT = 3.5;		//banner底部模糊渐变的高度(单位：rem)




// Page width: rem
export const PAGE_WIDTH = 75;		//页面宽度
