<?php
/**
 * Plugin Name: Expose Elementor Meta (migração temporária)
 * Description: Expõe as metas do Elementor na REST API para permitir a migração
 *              de páginas entre saudefrugal.com.br e saudefrugal.com.br/2026/.
 *              REMOVER após concluir a migração.
 *
 * INSTALAÇÃO: copie este arquivo para wp-content/mu-plugins/ (crie a pasta se
 * não existir) NOS DOIS sites — na raiz (para LER) e no /2026/ (para GRAVAR).
 * mu-plugins são ativados automaticamente, sem precisar ativar no painel.
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('rest_api_init', function () {
    $keys = [
        '_elementor_data',
        '_elementor_page_settings',
        '_elementor_template_type',
        '_elementor_version',
        '_elementor_edit_mode',
        '_wp_page_template',
    ];
    foreach ($keys as $key) {
        register_post_meta('page', $key, [
            'show_in_rest'  => true,
            'single'        => true,
            'type'          => 'string',
            // Só usuários que podem editar páginas leem/gravam estas metas.
            'auth_callback' => function () {
                return current_user_can('edit_pages');
            },
        ]);
    }
});
