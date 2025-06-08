// AI工具宝 - 主要JavaScript功能
class AIToolsApp {
    constructor() {
        this.tools = [];
        this.categories = {};
        this.currentCategory = 'all';
        this.searchQuery = '';
        this.init();
    }

    async init() {
        await this.loadData();
        this.initEventListeners();
        this.renderCategories();
        this.renderTools();
        this.updateStats();
    }

    async loadData() {
        // 动态加载 ai_tools_data.json
        const response = await fetch('ai_tools_data.json');
        const data = await response.json();
        this.categories = data.categories;
        this.tools = [];
        Object.values(this.categories).forEach(categoryTools => {
            this.tools.push(...categoryTools);
        });
    }

    initEventListeners() {
        // 搜索功能
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.querySelector('.search-btn');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch(e.target.value);
                }
            });
        }
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.handleSearch(searchInput.value);
            });
        }

        // 分类导航
        const categoryNav = document.getElementById('categoryNav');
        if (categoryNav) {
            categoryNav.addEventListener('click', (e) => {
                if (e.target.closest('.category-link')) {
                    e.preventDefault();
                    const categoryItem = e.target.closest('.category-item');
                    const category = categoryItem.dataset.category;
                    this.selectCategory(category);
                }
            });
        }

        // 侧边栏切换
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        }

        // 移动端菜单
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
        }

        // 模态框事件
        this.initModalEvents();
    }

    handleSearch(query) {
        this.searchQuery = query.trim().toLowerCase();
        
        if (this.searchQuery === '') {
            this.hideSearchResults();
            this.showDefaultSections();
        } else {
            this.showSearchResults();
        }
    }

    showSearchResults() {
        const filteredTools = this.tools.filter(tool => 
            tool.name.toLowerCase().includes(this.searchQuery) ||
            tool.description.toLowerCase().includes(this.searchQuery) ||
            tool.category.toLowerCase().includes(this.searchQuery)
        );

        // 隐藏默认区域
        this.hideDefaultSections();
        
        // 显示搜索结果
        const searchResultsSection = document.getElementById('searchResults');
        const searchResultsGrid = document.getElementById('searchResultsGrid');
        const searchResultsCount = document.getElementById('searchResultsCount');
        
        if (searchResultsSection && searchResultsGrid && searchResultsCount) {
            searchResultsSection.classList.remove('hidden');
            searchResultsCount.textContent = `找到 ${filteredTools.length} 个相关工具`;
            searchResultsGrid.innerHTML = this.renderToolCards(filteredTools);
        }
    }

    hideSearchResults() {
        const searchResultsSection = document.getElementById('searchResults');
        if (searchResultsSection) {
            searchResultsSection.classList.add('hidden');
        }
    }

    showDefaultSections() {
        const sections = ['.featured-section', '.latest-section', '.all-tools-section'];
        sections.forEach(selector => {
            const section = document.querySelector(selector);
            if (section) {
                section.classList.remove('hidden');
            }
        });
    }

    hideDefaultSections() {
        const sections = ['.featured-section', '.latest-section', '.all-tools-section'];
        sections.forEach(selector => {
            const section = document.querySelector(selector);
            if (section) {
                section.classList.add('hidden');
            }
        });
    }

    selectCategory(category) {
        this.currentCategory = category;
        
        // 更新分类导航样式
        const categoryItems = document.querySelectorAll('.category-item');
        categoryItems.forEach(item => {
            if (item.dataset.category === category) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // 更新内容标题
        const titleElement = document.getElementById('currentCategoryTitle');
        const subtitleElement = document.getElementById('currentCategorySubtitle');
        
        if (titleElement && subtitleElement) {
            if (category === 'all') {
                titleElement.textContent = '全部工具';
                subtitleElement.textContent = '发现更多AI工具';
            } else {
                titleElement.textContent = category;
                const categoryTools = this.categories[category] || [];
                subtitleElement.textContent = `共 ${categoryTools.length} 个工具`;
            }
        }

        // 清空搜索
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
        }
        this.searchQuery = '';
        this.hideSearchResults();
        this.showDefaultSections();

        // 重新渲染工具
        this.renderTools();
    }

    renderCategories() {
        const categoryList = document.querySelector('.category-list');
        if (!categoryList) return;

        const allCount = this.tools.length;
        document.getElementById('allCount').textContent = allCount;

        // 添加各个分类
        Object.keys(this.categories).forEach(category => {
            const tools = this.categories[category];
            const categoryItem = document.createElement('li');
            categoryItem.className = 'category-item';
            categoryItem.dataset.category = category;
            
            categoryItem.innerHTML = `
                <a href="#" class="category-link">
                    <span class="category-name">${category}</span>
                    <span class="category-count">${tools.length}</span>
                </a>
            `;
            
            categoryList.appendChild(categoryItem);
        });
    }

    renderTools() {
        this.renderFeaturedTools();
        this.renderLatestTools();
        this.renderAllTools();
    }

    renderFeaturedTools() {
        const featuredContainer = document.getElementById('featuredTools');
        if (!featuredContainer) return;

        const featuredTools = this.tools.filter(tool => tool.featured);
        featuredContainer.innerHTML = this.renderToolCards(featuredTools);
        this.attachToolCardEvents(featuredContainer);
    }

    renderLatestTools() {
        const latestContainer = document.getElementById('latestTools');
        if (!latestContainer) return;

        // 取最后6个工具作为最新工具
        const latestTools = this.tools.slice(-6);
        latestContainer.innerHTML = this.renderToolCards(latestTools);
        this.attachToolCardEvents(latestContainer);
    }

    renderAllTools() {
        const allToolsContainer = document.getElementById('allTools');
        if (!allToolsContainer) return;

        let toolsToShow = this.tools;
        if (this.currentCategory !== 'all') {
            toolsToShow = this.categories[this.currentCategory] || [];
        }

        allToolsContainer.innerHTML = this.renderToolCards(toolsToShow);
        this.attachToolCardEvents(allToolsContainer);
    }

    attachToolCardEvents(container) {
        if (!container) return;
        
        const toolCards = container.querySelectorAll('.tool-card');
        toolCards.forEach(card => {
            card.addEventListener('click', () => {
                const toolName = card.dataset.toolName;
                const tool = this.tools.find(t => t.name === toolName);
                if (tool) {
                    this.showToolModal(tool);
                }
            });
        });
    }

    renderToolCards(tools) {
        return tools.map(tool => `
            <div class="tool-card ${tool.featured ? 'featured' : ''}" data-tool-name="${tool.name}">
                <div class="tool-card__header">
                    <h3 class="tool-card__title">${tool.name}</h3>
                    ${tool.featured ? '<span class="tool-card__featured-badge">推荐</span>' : ''}
                </div>
                <p class="tool-card__description">${tool.description}</p>
                <div class="tool-card__footer">
                    <span class="tool-card__category">${tool.category}</span>
                    <svg class="tool-card__arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="m9 18 6-6-6-6"/>
                    </svg>
                </div>
            </div>
        `).join('');
    }

    updateStats() {
        const totalToolsElement = document.getElementById('totalTools');
        const totalCategoriesElement = document.getElementById('totalCategories');
        const featuredCountElement = document.getElementById('featuredCount');

        if (totalToolsElement) {
            totalToolsElement.textContent = this.tools.length;
        }
        
        if (totalCategoriesElement) {
            totalCategoriesElement.textContent = Object.keys(this.categories).length;
        }
        
        if (featuredCountElement) {
            const featuredCount = this.tools.filter(tool => tool.featured).length;
            featuredCountElement.textContent = featuredCount;
        }
    }

    toggleSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const toggle = document.getElementById('sidebarToggle');
        
        if (sidebar && toggle) {
            const categoryNav = document.getElementById('categoryNav');
            if (categoryNav.style.display === 'none') {
                categoryNav.style.display = 'block';
                toggle.style.transform = 'rotate(0deg)';
            } else {
                categoryNav.style.display = 'none';
                toggle.style.transform = 'rotate(180deg)';
            }
        }
    }

    toggleMobileMenu() {
        const nav = document.querySelector('.header__nav');
        if (nav) {
            nav.style.display = nav.style.display === 'none' ? 'flex' : 'none';
        }
    }

    initModalEvents() {
        const modalOverlay = document.getElementById('modalOverlay');
        const modalClose = document.getElementById('modalClose');
        const visitTool = document.getElementById('visitTool');
        const shareTool = document.getElementById('sharetool');

        if (modalClose) {
            modalClose.addEventListener('click', () => this.hideModal());
        }

        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    this.hideModal();
                }
            });
        }

        if (visitTool) {
            visitTool.addEventListener('click', () => {
                // 访问工具按钮的点击事件
            });
        }
/*
        if (shareTool) {
            shareTool.addEventListener('click', () => {
                if (navigator.share) {
                    navigator.share({
                        title: '分享AI工具',
                        text: '发现了一个很棒的AI工具！',
                        url: window.location.href
                    });
                } else {
                    alert('分享功能在此演示中不可用');
                }
            });
        }
*/
        // ESC键关闭模态框
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideModal();
            }
        });
    }

    showToolModal(tool) {
        const modal = document.getElementById('modalOverlay');
        const modalTitle = document.getElementById('modalTitle');
        const modalDescription = document.getElementById('modalDescription');
        const modalCategory = document.getElementById('modalCategory');
        const visitToolBtn = document.getElementById('visitTool');
        const shareToolBtn = document.getElementById('sharetool');
        
        if (modal && modalTitle && modalDescription && modalCategory && visitToolBtn && shareToolBtn) {
            modalTitle.textContent = tool.name;
            modalDescription.textContent = tool.description;
            modalCategory.textContent = tool.category;
            
            // 设置访问工具按钮的点击事件
            visitToolBtn.onclick = () => {
                if (tool.url) {
                    window.open(tool.url, '_blank');
                }
            };
            
            // 设置“复制链接”按钮的点击事件
            shareToolBtn.textContent = '复制链接';
            shareToolBtn.onclick = () => {
                if (tool.url) {
                    navigator.clipboard.writeText(tool.url).then(() => {
                        alert('链接已复制');
                    });
                }
            };
            
            modal.classList.remove('hidden');
        }
    }

    hideModal() {
        const modalOverlay = document.getElementById('modalOverlay');
        if (modalOverlay) {
            modalOverlay.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    (new AIToolsApp());
});