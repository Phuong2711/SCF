from odoo import api, fields, models, _


class ScfAccountMove(models.Model):
    _name = "scf.account.move"
    _description = "SCF Account Move"
    _sql_constraints = [
        ("amount_not_under_0", "CHECK (amount > 0)", _("Amount cannot be lower than 0!")),
    ]

    name = fields.Char("Name")
    user_id = fields.Many2one("res.users", default=lambda self: self.env.user, readonly=True)
    image = fields.Binary("Image")
    amount = fields.Integer("Amount")
    state = fields.Selection([("draft", "Draft"), ("wait_confirm", "Wait Auditing"), ("confirmed", "Confirmed"), ("reject", "Rejected")], default="draft")

    def action_send_request(self):
        for rec in self:
            if rec.state != "draft":
                return
            rec.state = "wait_confirm";

    def action_confirm(self):
        for rec in self:
            if rec.state != "wait_confirm":
                return
            rec.user_id.write({
                'scf_balance': rec.user_id.scf_balance + rec.amount,
            })
            rec.state = "confirmed"

    def action_reject(self):
        for rec in self:
            if rec.state != "wait_confirm":
                return
            rec.state = "reject"
