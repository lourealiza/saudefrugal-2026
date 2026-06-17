<?php
/**
 * Plugin Name: Expose Elementor Meta (migração temporária)
 * Description: Cria um campo REST 'elementor_export' nas páginas para LER e GRAVAR
 *              as metas do Elementor (que são protegidas e não saem por register_post_meta).
 *              Usado para migrar páginas entre saudefrugal.com.br e .../2026/.
 *              REMOVER após concluir a migração.
 *
 * INSTALAÇÃO: copie ESTE ARQUIVO (não a pasta) para wp-content/mu-plugins/ — crie
 * a pasta se não existir — NOS DOIS sites (raiz para LER, /2026/ para GRAVAR).
 * mu-plugins ativam sozinhos. O campo só é legível/gravável por quem pode editar
 * a página (current_user_can edit_post).
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

    register_rest_field('page', 'elementor_export', [
        'get_callback' => function ($post) use ($keys) {
            if (!current_user_can('edit_post', $post['id'])) {
                return null;
            }
            $out = [];
            foreach ($keys as $k) {
                $v = get_post_meta($post['id'], $k, true);
                if ($v !== '' && $v !== null) {
                    $out[$k] = is_string($v) ? $v : wp_json_encode($v);
                }
            }
            return $out;
        },
        'update_callback' => function ($value, $post) use ($keys) {
            if (!current_user_can('edit_post', $post->ID)) {
                return;
            }
            if (!is_array($value)) {
                return;
            }
            foreach ($keys as $k) {
                if (array_key_exists($k, $value) && $value[$k] !== '') {
                    // wp_slash: update_metadata faz unslash internamente; o JSON do
                    // Elementor precisa entrar slashed para ser gravado intacto.
                    update_post_meta($post->ID, $k, wp_slash($value[$k]));
                }
            }
        },
        'schema' => [
            'description' => 'Metas do Elementor para migração (read/write).',
            'type'        => 'object',
        ],
    ]);
});
