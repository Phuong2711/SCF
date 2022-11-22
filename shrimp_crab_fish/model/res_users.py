from odoo import api, fields, models


class ResUsers(models.Model):
    _inherit = "res.users"

    scf_balance = fields.Integer(string="Balance")

    @api.model
    def retrive_user_data(self):
        res = {}
        user = self.sudo().env.user
        res['name'] = user.name
        res['balance'] = user.scf_balance
        return res