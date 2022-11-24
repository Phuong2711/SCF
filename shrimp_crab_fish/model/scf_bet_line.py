from odoo import api, fields, models


class ScfBetLine(models.Model):
    _name = "scf.bet.line"

    user_id = fields.Many2one('res.users')
    bet_result = fields.Integer('Bet result')
    bet_amount = fields.Integer('Bet amount')
    scf_table_id = fields.Many2one('scf.table')