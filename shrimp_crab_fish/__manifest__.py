# -*- coding: utf-8 -*-
{
    'name': "Shrimp Crab Fish",
    'description': """
        This is test Owl module
    """,
    'author': "Phuong2711",
    'website': "https://github.com/Phuong2711",
    'license': 'LGPL-3',
    'category': 'Shrimp Crab Fish/Shrimp Crab Fish',
    'version': '1',
    'depends': ['hr'],
    'assets': {
            'web.assets_backend': [
                'shrimp_crab_fish/static/src/js/SCFDashboard.js',
                'shrimp_crab_fish/static/src/css/SCFDashboard.scss',
            ],
            'web.assets_qweb': [
                'shrimp_crab_fish/static/src/xml/**/*'
            ],

    },
    'data': [
        'data/scf_table_data.xml',
        'security/scf_security.xml',
        'security/ir.model.access.csv',
        'view/res_users_view.xml',
        'view/scf_account_move_view.xml',
        'view/scf_table_view.xml',
        'view/menu.xml',
    ],
    'license': 'LGPL-3',
    'application': True,
}
