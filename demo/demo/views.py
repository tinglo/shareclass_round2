# -*- coding: utf-8 -*-

from django.http import HttpResponse
from django.template.loader import get_template
from django import template
from django.shortcuts import render_to_response


def home_page(request):
	return render_to_response('index.html')