import {SidebarConfig4Multiple} from "vuepress/config";

import compositionPrincipleSidebar from './sidebars/foundation/compositionPrincipleSidebar';

// @ts-ignore
export default {
    "/docs/基本功/计算机组成原理/": compositionPrincipleSidebar,
    // 降级，默认根据文章标题渲染侧边栏
    "/": "auto",
} as SidebarConfig4Multiple;
