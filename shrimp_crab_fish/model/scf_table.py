from odoo import api, fields, models
import time
from random import randint


class ScfTable(models.Model):
    _name = 'scf.table'

    name = fields.Char('Name')
    result_dice_1 = fields.Integer('Result 1')
    result_dice_2 = fields.Integer('Result 2')
    result_dice_3 = fields.Integer('Result 3')
    time_per_round = fields.Integer('Time per round')
    current_time = fields.Integer('Current time')
    scf_bet_line_ids = fields.One2many('scf.bet.line', 'scf_table_id')
    state = fields.Selection([('open', 'Open'), ('close', 'Close')])

    @api.model
    def _countdown(self):
        rec = self.env.ref("shrimp_crab_fish.scf_table_1")
        rec.current_time = rec.time_per_round
        rec.state = 'open'
        self._cr.commit()
        while rec.current_time > 0 :
            time.sleep(1)
            rec.current_time = rec.current_time - 1
            if rec.current_time == 10:
                rec.generate_result()
                rec.state = 'close'
            self._cr.commit()
        time.sleep(3)
        rec.pay_win()
        self._cr.commit()
        time.sleep(7)
        rec.scf_bet_line_ids = False
        self._cr.commit()
        rec._countdown()

    def action_start_game(self):
        rec = self.env.ref("shrimp_crab_fish.scf_table_1")
        rec.scf_bet_line_ids = False
        return rec._countdown()


    @api.model
    def refresh_table_data(self):
        rec = self.env.ref("shrimp_crab_fish.scf_table_1")
        res = rec.current_time
        return res

    @api.model
    def refresh_result_data(self):
        res = {}
        rec = self.env.ref("shrimp_crab_fish.scf_table_1")
        res['res1'] = rec.result_dice_1
        res['res2'] = rec.result_dice_2
        res['res3'] = rec.result_dice_3
        return res

    @api.model
    def refresh_all_bet(self):
        rec = self.env.ref("shrimp_crab_fish.scf_table_1")
        res = []
        for line in rec.sudo().scf_bet_line_ids:
            res.append({'user_name': line.user_id.name, 'bet_result': line.bet_result, 'bet_amount': line.bet_amount})
        return res

    @api.model
    def get_scf_table_id(self):
        return self.env.ref("shrimp_crab_fish.scf_table_1").id

    @api.model
    def generate_result(self):
        rec = self.env.ref("shrimp_crab_fish.scf_table_1")
        rec.result_dice_1 = randint(0, 5)
        rec.result_dice_2 = randint(0, 5)
        rec.result_dice_3 = randint(0, 5)

    @api.model
    def pay_win(self):
        rec = self.env.ref("shrimp_crab_fish.scf_table_1")
        bet_line_ids = rec.scf_bet_line_ids

        result = {rec.result_dice_1, rec.result_dice_2, rec.result_dice_3}
        for line in bet_line_ids.filtered(lambda l: l.bet_result in result):
            user = line.sudo().user_id
            user.write({
                'scf_balance': user.scf_balance + line.bet_amount
            })
        # Pay result 1 win
        for line in bet_line_ids.filtered(lambda l: l.bet_result == rec.result_dice_1):
            user = line.sudo().user_id
            user.write({
                'scf_balance': user.scf_balance + line.bet_amount
            })

        # Pay result 2 win
        for line in bet_line_ids.filtered(lambda l: l.bet_result == rec.result_dice_2):
            user = line.sudo().user_id
            user.write({
                'scf_balance': user.scf_balance + line.bet_amount
            })

        # Pay result 3 win
        for line in bet_line_ids.filtered(lambda l: l.bet_result == rec.result_dice_3):
            user = line.sudo().user_id
            user.write({
                'scf_balance': user.scf_balance + line.bet_amount
            })

