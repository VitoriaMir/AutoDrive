/**
 * Section Loader - Carregamento dinâmico de seções do dashboard
 * Permite modularizar o dashboard dividindo seções em arquivos separados
 */

class SectionLoader {
    constructor() {
        this.loadedSections = new Set();
        this.sectionCache = new Map();
        this.init();
    }

    init() {
        // Carrega as seções quando o DOM estiver pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.loadAllSections());
        } else {
            this.loadAllSections();
        }
    }

    /**
     * Carrega todas as seções configuradas
     */
    async loadAllSections() {
        const sections = [
            {
                id: 'students-section',
                placeholder: 'students-section-placeholder',
                file: '/sections/students-section.html'
            },
            {
                id: 'instructors-section',
                placeholder: 'instructors-section-placeholder',
                file: '/sections/instructors-section.html'
            },
            {
                id: 'vehicles-section',
                placeholder: 'vehicles-section-placeholder',
                file: '/sections/vehicles-section.html'
            },
            {
                id: 'schedule-section',
                placeholder: 'schedule-section-placeholder',
                file: '/sections/schedule-section.html'
            },
            {
                id: 'exams-section',
                placeholder: 'exams-section-placeholder',
                file: '/sections/exams-section.html'
            },
            {
                id: 'finance-section',
                placeholder: 'finance-section-placeholder',
                file: '/sections/finance-section.html'
            },
            {
                id: 'reports-section',
                placeholder: 'reports-section-placeholder',
                file: '/sections/reports-section.html'
            },
            {
                id: 'settings-section',
                placeholder: 'settings-section-placeholder',
                file: '/sections/settings-section.html'
            }
            // Adicione aqui outras seções conforme necessário
        ];

        for (const section of sections) {
            await this.loadSection(section);
        }
    }

    /**
     * Carrega uma seção específica
     * @param {Object} sectionConfig - Configuração da seção
     * @param {string} sectionConfig.id - ID da seção
     * @param {string} sectionConfig.placeholder - ID do placeholder no DOM
     * @param {string} sectionConfig.file - Caminho do arquivo da seção
     */
    async loadSection({ id, placeholder, file }) {
        try {
            // Verifica se a seção já foi carregada
            if (this.loadedSections.has(id)) {
                return;
            }

            // Verifica se o placeholder existe
            const placeholderElement = document.getElementById(placeholder);
            if (!placeholderElement) {
                console.warn(`Placeholder '${placeholder}' não encontrado para a seção '${id}'`);
                return;
            }

            // Carrega o conteúdo da seção
            let content = this.sectionCache.get(file);
            if (!content) {
                const response = await fetch(file);
                if (!response.ok) {
                    throw new Error(`Falha ao carregar seção: ${response.status} ${response.statusText}`);
                }
                content = await response.text();
                this.sectionCache.set(file, content);
            }

            // Substitui o placeholder pelo conteúdo da seção
            placeholderElement.outerHTML = content;
            this.loadedSections.add(id);

            // Dispara evento personalizado para notificar que a seção foi carregada
            this.dispatchSectionLoadedEvent(id, file);

            console.log(`Seção '${id}' carregada com sucesso de '${file}'`);

        } catch (error) {
            console.error(`Erro ao carregar seção '${id}':`, error);

            // Remove o placeholder em caso de erro
            const placeholderElement = document.getElementById(placeholder);
            if (placeholderElement) {
                placeholderElement.style.display = 'none';
            }
        }
    }

    /**
     * Dispara evento customizado quando uma seção é carregada
     * @param {string} sectionId - ID da seção carregada
     * @param {string} file - Arquivo da seção
     */
    dispatchSectionLoadedEvent(sectionId, file) {
        const event = new CustomEvent('sectionLoaded', {
            detail: { sectionId, file }
        });
        document.dispatchEvent(event);
    }

    /**
     * Verifica se uma seção está carregada
     * @param {string} sectionId - ID da seção
     * @returns {boolean}
     */
    isSectionLoaded(sectionId) {
        return this.loadedSections.has(sectionId);
    }

    /**
     * Limpa o cache das seções
     */
    clearCache() {
        this.sectionCache.clear();
    }

    /**
     * Recarrega uma seção específica
     * @param {string} sectionId - ID da seção
     */
    async reloadSection(sectionId) {
        // Encontra a configuração da seção (você pode expandir isso)
        const sectionConfigs = {
            'students-section': {
                id: 'students-section',
                placeholder: 'students-content',
                file: '/sections/students-section.html'
            }
        };

        const config = sectionConfigs[sectionId];
        if (!config) {
            console.error(`Configuração não encontrada para a seção '${sectionId}'`);
            return;
        }

        // Remove do cache e da lista de carregadas
        this.sectionCache.delete(config.file);
        this.loadedSections.delete(sectionId);

        // Recarrega a seção
        await this.loadSection(config);
    }
}

// Instancia o loader automaticamente
const sectionLoader = new SectionLoader();

// Exporta para uso global se necessário
window.SectionLoader = SectionLoader;
window.sectionLoader = sectionLoader;
