<!-- 这是从零开始写的一个级联选择器组件，负责展开一个多层级面板 -->
<script lang="ts">
    interface CategoryNode {
        value: string;
        label: string;
        children?: CategoryNode[];
    }

    interface Props {
        options: CategoryNode[];
    }

    let { options }: Props = $props();

    let isOpen = $state(false);
    let leaveTimer: ReturnType<typeof setTimeout> | null = null;

    // activePath tracks which item is hovered in each column
    // e.g. [1, 2] means column 0 item 1 is hovered, column 1 item 2 is hovered
    let activePath = $state<number[]>([]);

    // menus is an array of columns, each column is an array of items at that depth
    let menus = $derived.by(() => {
        let opts = options;
        const result = [opts];
        for (const idx of activePath) {
            if (opts[idx]?.children) {
                opts = opts[idx].children!;
                result.push(opts);
            }
        }
        return result;
    });

    //负责清除定时器，防止快速hover时定时器冲突
    function handleMouseEnter() {
        if (leaveTimer) {
            clearTimeout(leaveTimer);
            leaveTimer = null;
        }
        isOpen = true;
    }

    //延迟120ms关闭，不然鼠标一移动容易面板消失
    function handleMouseLeave() {
        // Delay closing so user has time to move cursor onto the panel
        leaveTimer = setTimeout(() => {
            isOpen = false;
            activePath = [];
        }, 120);
    }

    // 让 hover 面板本身也能保持面板打开
    function handlePanelMouseEnter() {
        if (leaveTimer) {
            clearTimeout(leaveTimer);
            leaveTimer = null;
        }
        isOpen = true;
    }

    // Hover on an item in a specific column
    function hoverItem(colIdx: number, itemIdx: number) {
        const item = menus[colIdx][itemIdx];
        // Truncate path back to this column's depth
        activePath = activePath.slice(0, colIdx);
        if (item.children && item.children.length > 0) {
            // Expand to show the next column
            activePath = [...activePath, itemIdx];
        }
    }

    function clickItem(colIdx: number, itemIdx: number) {
        const item = menus[colIdx][itemIdx];
        if (!item.children || item.children.length === 0) {
            isOpen = false;
            activePath = [];
            window.location.href = `/archive/?category=${encodeURIComponent(item.value)}`;
        }
    }

    function handleClickOutside(e: MouseEvent) {
        const target = e.target as HTMLElement;
        if (!target.closest('.cascader-wrapper')) {
            isOpen = false;
            activePath = [];
        }
    }
</script>

<svelte:window onclick={handleClickOutside} />

<div class="cascader-wrapper" onmouseenter={handleMouseEnter} onmouseleave={handleMouseLeave}>
    <button
        type="button"
        class="cascader-trigger h-11"
    >
        <span>Categories</span>
        <svg class="cascader-arrow" class:open={isOpen} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
    </button>

    {#if isOpen}
        <div class="cascader-panel" onmouseenter={handlePanelMouseEnter}>
            {#each menus as column, colIdx}
                <div class="cascader-column">
                    {#each column as item, itemIdx}
                        <button
                            type="button"
                            class="cascader-option"
                            onclick={() => clickItem(colIdx, itemIdx)}
                            onmouseenter={() => hoverItem(colIdx, itemIdx)}
                        >
                            <span>{item.label}</span>
                            {#if item.children && item.children.length > 0}
                                <svg class="option-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                </svg>
                            {/if}
                        </button>
                    {/each}
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    .cascader-wrapper {
        position: relative;
    }

    .cascader-trigger {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: transparent;
        border: 1px solid transparent;
        border-radius: 0.5rem;
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--text, #374151);
        cursor: pointer;
        transition: background-color 0.15s, border-color 0.15s;
    }

    .cascader-trigger:hover {
        background: var(--btn-plain-bg-hover, #f3f4f6);
    }

    .cascader-arrow {
        width: 1rem;
        height: 1rem;
        opacity: 0.5;
        transition: transform 0.2s;
    }

    .cascader-arrow.open {
        transform: rotate(180deg);
    }

    .cascader-panel {
        position: absolute;
        top: 100%;
        left: 0;
        margin-top: 0.25rem;
        z-index: 50;
        display: flex;
        background: var(--card-bg, #fff);
        border: 1px solid var(--border, #e5e7eb);
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
        overflow: auto;   /* 列过多时横向滚动 */
        max-width: 100vw; /* 不超出视口 */
    }

    .cascader-column {
        min-width: 160px;
        max-height: 240px;
        overflow-y: auto;
        border-right: 1px solid var(--border, #e5e7eb);
    }

    .cascader-column:last-child {
        border-right: none;
    }

    .cascader-option {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 0.5rem 0.75rem;
        background: none;
        border: none;
        text-align: left;
        font-size: 0.875rem;
        color: var(--text, #374151);
        cursor: pointer;
        transition: background-color 0.15s;
    }

    .cascader-option:hover {
        background: var(--btn-plain-bg-hover, #f3f4f6);
    }

    .option-arrow {
        width: 1rem;
        height: 1rem;
        opacity: 0.4;
    }
</style>
