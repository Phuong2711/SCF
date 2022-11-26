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
    is_generated_result = fields.Boolean(default=False)

    @api.model
    def _countdown(self):
        rec = self.env.ref("shrimp_crab_fish.scf_table_1")
        rec.current_time = rec.time_per_round
        rec.state = 'open'
        rec.is_generated_result = False
        self._cr.commit()
        while rec.current_time > -1 :
            time.sleep(1)
            rec.current_time = rec.current_time - 1
            if rec.current_time == 10:
                rec.generate_result()
            self._cr.commit()

    @api.model
    def refresh_table_data(self):
        res = {}
        rec = self.env.ref("shrimp_crab_fish.scf_table_1")
        res['current_time'] = rec.current_time
        if rec.current_time == -1:
            res['current_time'] = "Stop"
        return res

    @api.model
    def refresh_result_data(self):
        res = {}
        rec = self.env.ref("shrimp_crab_fish.scf_table_1")
        res['result-1'] = rec.result_dice_1
        res['result-2'] = rec.result_dice_2
        res['result-3'] = rec.result_dice_3
        return res

    @api.model
    def get_scf_table_id(self):
        return self.env.ref("shrimp_crab_fish.scf_table_1").id

    @api.model
    def generate_result(self):
        rec = self.env.ref("shrimp_crab_fish.scf_table_1")
        if rec.is_generated_result:
            return
        rec.result_dice_1 = randint(0, 5)
        rec.result_dice_2 = randint(0, 5)
        rec.result_dice_3 = randint(0, 5)
        rec.is_generated_result = True