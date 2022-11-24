from odoo import api, fields, models
import time


class ScfTable(models.Model):
    _name = 'scf.table'

    name = fields.Char('Name')
    result_dice_1 = fields.Integer('Result 1')
    result_dice_2 = fields.Integer('Result 2')
    result_dice_3 = fields.Integer('Result 3')
    time_per_round = fields.Integer('Time per round')
    current_time = fields.Integer('Current time')
    scf_bet_line_ids = fields.One2many('scf.bet.line', 'scf_table_id')
    state = fields.Selection([('bet', 'Betting'), ('nobet', 'No more bet')])

    @api.model
    def _countdown(self):
        rec = self.env.ref("shrimp_crab_fish.scf_table_1")
        rec.current_time = rec.time_per_round
        while rec.current_time > 0 :
            time.sleep(1)
            rec.current_time = rec.current_time - 1
            print(self.env.ref("shrimp_crab_fish.scf_table_1").current_time)
        rec.state = 'nobet'
        print(rec.state)

    @api.model
    def refresh_table_data(self):
        res = {}
        rec = self.env.ref("shrimp_crab_fish.scf_table_1")
        res['current_time'] = rec.current_time
        return res

    @api.model
    def refresh_result_data(self):
        res = {}
        rec = self.env.ref("shrimp_crab_fish.scf_table_1")
        res['result-1'] = rec.result_dice_1
        res['result-2'] = rec.result_dice_2
        res['result-3'] = rec.result_dice_3
        return res
