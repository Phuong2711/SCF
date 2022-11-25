from odoo import api, fields, models, _


class ResUsers(models.Model):
    _inherit = "res.users"
    _sql_constraints = [
        ("balance_not_under_0", "CHECK (scf_balance >= 0)", _("You are not enough credit, please deposit and try again !")),
    ]

    scf_balance = fields.Integer(string="Balance")

    @api.model
    def retrive_user_data(self):
        res = {}
        user = self.sudo().env.user
        res['name'] = user.name
        res['balance'] = user.scf_balance
        return res

    @api.model
    def check_access_right(self):
        return self.env.user.has_group("shrimp_crab_fish.group_scf_manager")