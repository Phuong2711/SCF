from odoo import api, fields, models, _


class ResUsers(models.Model):
    _inherit = "res.users"
    _sql_constraints = [
        ("balance_not_under_0", "CHECK (scf_balance >= 0)", _("You are not enough credit, please deposit and try again !")),
    ]

    scf_balance = fields.Integer(string="Balance")

    @api.model
    def retrive_balance(self):
        return self.sudo().env.user.scf_balance