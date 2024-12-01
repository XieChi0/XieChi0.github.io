import {SidebarConfig4Multiple} from "vuepress/config";
import algorithmSidebar from './sidebars/foundation/algorithmSidebar';
import compositionPrincipleSidebar from './sidebars/foundation/compositionPrincipleSidebar';
import personalSidebar from './sidebars/foundation/personalSidebar';

// @ts-ignore
export default {
    "/docs/基本功/计算机组成原理/": compositionPrincipleSidebar,
    "/docs/基本功/算法/": algorithmSidebar,
    "/docs/Personal/": personalSidebar,
    // 降级，默认根据文章标题渲染侧边栏
    "/": "auto",
} as SidebarConfig4Multiple;
