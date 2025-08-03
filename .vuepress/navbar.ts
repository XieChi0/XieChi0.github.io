import {NavItem} from "vuepress/config";

export default [
    {
        text: "基本功",
        link: '/docs/基本功/',
        items: [
            {
                text: "数据结构",
                link: '/docs/基本功/数据结构/ds.md',
            },
            {
                text:'C++',
                link:'/docs/基本功/C++/C++.md',
            },
            {
                text: "算法",
                link: '/docs/基本功/算法/',
            }


        ]
    },
    {
        text: "前端",
        link: '/docs/前端/',
        items: [
            {
                text: "HTML",
                link: '/docs/前端/HTML/html篇.md',
            },
            {
                text: "CSS",
                link: '/docs/前端/CSS/css篇.md',
            },
            {
                text: "JavaScript",
                link: '/docs/前端/JavaScript/js篇.md',
            },
            {
                text: "Vue",
                link: '/docs/前端/Vue/vue篇.md',
            },
            {
                text: "Axios及其他",
                link: '/docs/前端/Axios及其他/其他技术篇.md',
            }

        ]
    },
    // {
    //     text: "Personal",
    //     items: [
    //         {
    //             text:"个人思路体系规划",
    //             link:"/docs/个人思路体系规划/个思.md"
    //         },
    //         {
    //             text: "文创购分",
    //             link: '/docs/文创购分.md',
    //         },
    //         {
    //             text: "brand灵感板+定期学习",
    //             link: '/docs/brand灵感板+定期学习.md',
    //         },
    //         {
    //             text: "psv",
    //             link: '/docs/psv.md',
    //         }
    //     ]
    // }
    {
        text:"框架",
        link:"/docs/框架/",
        items:[
            {
                text:"Nodejs",
                link:"/docs/框架/Nodejs/nodejs篇.md",
            },
            {
                text:"Electron",
                link:"/docs/框架/Electron/electron篇.md",
            }
        ]
    },
    {
        text:'业务',
        link:'/docs/业务/',
        items:[
            {
                text:"sw",
                link:"/docs/业务/sw/sw.md",
            },
            {
                text:"st",
                link:"/docs/业务/st/st.md",
            }
        ]
    }

] as NavItem[];
