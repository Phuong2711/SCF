from odoo import api, fields, models


class ScfBetLine(models.Model):
    _name = "scf.bet.line"

    user_id = fields.Many2one('res.users')
    bet_result = fields.Integer('Bet result')
    bet_amount = fields.Integer('Bet amount')
    scf_table_id = fields.Many2one('scf.table')

    @api.model
    def create(self, values):
        if self.sudo().env['scf.table'].browse(values.get('scf_table_id')).state == 'close':
            return
        bet_user = self.sudo().env['res.users'].browse(values.get('user_id'))
        bet_user.write({
            'scf_balance': bet_user.scf_balance - values.get('bet_amount')
        })
        return super(ScfBetLine, self).create(values)